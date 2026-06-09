from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Budget
from .serializers import BudgetSerializer
from elaborationBudget.models import AmenagementBudget ,ModificationSuppressionBudget
from pta.models import PTA
from typeComptes.models import TypeComptes
from comptes.models import Comptes
from django.db import models  # Ajoutez cette ligne pour importer le module models
from django.db import connection
from django.http import HttpResponse
from xhtml2pdf import pisa
from django.template.loader import render_to_string
from django.db.models import F
from django.db.models import F, Sum, Value, Case, When, DecimalField, IntegerField
from django.db.models.functions import Cast
from django.db.models import Sum, F, Case, When, Value
from django.db.models.functions import Extract 
from django.db.models import Prefetch
import psycopg2




class BudgetListView(APIView):
    def get(self, request):
        budgets = Budget.objects.all()
        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("Données reçues:", request.data)
        
        # Vérification des types
        if not isinstance(request.data.get('id_compte'), int):
            return Response({'error': 'id_compte doit être un entier'}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(request.data.get('id_ville'), int):
            return Response({'error': 'id_ville doit être un entier'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = BudgetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class BudgetList5ans(APIView):
    def get(self, request, annee_debut):
        # Validation que l'année de début est un entier
        try:
            annee_debut = int(annee_debut)
        except ValueError:
            return Response(
                {'error': 'L\'année de début doit être un entier valide.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calcul de l'intervalle d'années
        annee_fin = annee_debut + 5

        # Filtrer les budgets dans l'intervalle
        budgets = Budget.objects.filter(annee__gte=annee_debut, annee__lt=annee_fin)

        # Vérifier que des budgets existent
        if not budgets.exists():
            return Response(
                {'message': 'Aucun budget trouvé pour l\'intervalle donné.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Sérialisation et retour des données
        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data)


class BudgetDetailView(APIView):
    def get(self, request, pk):
        try:
            budget = Budget.objects.get(pk=pk)
        except Budget.DoesNotExist:
            return Response(
                {'error': 'Budget non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = BudgetSerializer(budget)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            budget = Budget.objects.get(pk=pk)
        except Budget.DoesNotExist:
            return Response(
                {'error': 'Budget non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BudgetSerializer(budget, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()  # Mettre à jour les données dans la base de données
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            budget = Budget.objects.get(pk=pk)
        except Budget.DoesNotExist:
            return Response(
                {'error': 'Budget non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        budget.delete()  # Supprimer le budget
        return Response(
            {'message': 'Budget supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )

class VisualisationInvestissement(APIView):
    def get(self, request):
        # Récupérer les paramètres de la requête
        code_programme = request.query_params.get('code_programme')
        annee = request.query_params.get('annee')
        tri = request.query_params.get('tri')

        # Vérification des paramètres
        if not code_programme or not annee or not tri:
            return Response({"error": "Tous les paramètres sont nécessaires (code_programme, annee, tri)"}, status=400)

        # Filtrer les comptes d'investissement (id_type_compte = 2 pour 'depense-Investissements')
        comptes_investissement = Comptes.objects.filter(id_type_compte=2)

        # Filtrer les budgets associés aux comptes d'investissement
        budgets = Budget.objects.filter(code_programme=code_programme, annee=annee, id_compte__in=comptes_investissement)

        # Joindre les autres informations nécessaires (par exemple, montant du budget, modif, etc.)
        if tri == 'montant':
            # Tri par montant
            budgets = budgets.annotate(total_montant=Sum('montant')).order_by('-total_montant')
        elif tri == 'compte':
            # Tri par compte
            budgets = budgets.order_by('id_compte')

        # Récupérer les données de PTA associées au budget
        pta = PTA.objects.filter(code_programme=code_programme, annee=annee)

        # Récupérer les données d'amenagement_budget
        amenagements = AmenagementBudget.objects.filter(annee=annee)

        # Fusionner et structurer les résultats sous forme d'une liste
        results = []
        for budget in budgets:
            # Calculer le total des attachements pour ce budget
            total_attachements = ModificationSuppressionBudget.objects.filter(id_budget=budget.id_budget).aggregate(
                total_attach=Sum(
                    Case(
                        When(attach1__isnull=True, then=Value(0)),
                        default=F('attach1'),
                        output_field=models.DecimalField()
                    ) +
                    Case(
                        When(attach2__isnull=True, then=Value(0)),
                        default=F('attach2'),
                        output_field=models.DecimalField()
                    ) +
                    Case(
                        When(attach3__isnull=True, then=Value(0)),
                        default=F('attach3'),
                        output_field=models.DecimalField()
                    ) +
                    Case(
                        When(attach4__isnull=True, then=Value(0)),
                        default=F('attach4'),
                        output_field=models.DecimalField()
                    ) +  
                    Case(
                        When(attach5__isnull=True, then=Value(0)),
                        default=F('attach5'),
                        output_field=models.DecimalField()
                    ) + 
                    Case(
                        When(attach6__isnull=True, then=Value(0)),
                        default=F('attach6'),
                        output_field=models.DecimalField()
                    ) +
                    Case(
                        When(attach7__isnull=True, then=Value(0)),
                        default=F('attach7'),
                        output_field=models.DecimalField()
                    ) + 
                    Case(
                        When(attach8__isnull=True, then=Value(0)),
                        default=F('attach8'),
                        output_field=models.DecimalField()
                    ) +  
                    Case(
                        When(attach9__isnull=True, then=Value(0)),
                        default=F('attach9'),
                        output_field=models.DecimalField()
                    ) + 
                    Case(
                        When(attach10__isnull=True, then=Value(0)),
                        default=F('attach10'),
                        output_field=models.DecimalField()
                    ) + 
                    Case(
                        When(attach11__isnull=True, then=Value(0)),
                        default=F('attach11'),
                        output_field=models.DecimalField()
                    ) +    
                    Case(
                        When(attach12__isnull=True, then=Value(0)),
                        default=F('attach12'),
                        output_field=models.DecimalField()
                    ) +     
                    # Ajoutez ici les autres champs attach3 à attach20...
                    Case(
                        When(attach20__isnull=True, then=Value(0)),
                        default=F('attach20'),
                        output_field=models.DecimalField()
                    )
                )
            )['total_attach'] or 0

            # Calculer le montant après modification
            modif_plus = amenagements.filter(id_budget=budget.id_budget).aggregate(Sum('modif_plus'))['modif_plus__sum'] or 0
            modif_moins = amenagements.filter(id_budget=budget.id_budget).aggregate(Sum('modif_moins'))['modif_moins__sum'] or 0
            montant_apres_modification = budget.montant + modif_plus - modif_moins

            # Récupérer le code_compte depuis la table 'comptes'
            code_compte = budget.id_compte.code  # Champ 'code' de la table 'comptes'

            # Calculer le 'credit' basé sur une logique, par exemple, utiliser le montant et les modifications
            credit = budget.montant + total_attachements + modif_plus - modif_moins

            # Créer une structure de résultat pour chaque budget
            result = {
                'programme': budget.code_programme,
                'compte': budget.id_compte.id_compte,  # Renvoie l'ID du compte
                'code_compte': code_compte,  # Ajoutez le code du compte
                'libelle': budget.libelle,
                'montant': budget.montant,
                'montant_apres_modification': montant_apres_modification,
                'total_attachements': total_attachements,
                'modif_plus': modif_plus,
                'modif_moins': modif_moins,
                'credit': credit,  # Calcul du crédit
                'pta': pta.filter(code_programme=budget.code_programme).values('libelle', 'montant'),
            }
            results.append(result)

        # Retourner les résultats
        return Response(results)


class VisualisationInvestissement5ans(APIView):
    def get(self, request):
        # Récupérer les paramètres de la requête
        code_programme = request.query_params.get('code_programme')
        annee_debut = request.query_params.get('annee')
        tri = request.query_params.get('tri')

        # Vérification des paramètres
        if not code_programme or not annee_debut or not tri:
            return Response({"error": "Tous les paramètres sont nécessaires (code_programme, annee, tri)"}, status=400)

        # Convertir annee_debut en entier
        annee_debut = int(annee_debut)

        # Créer une liste des 5 années successives
        annees = [annee_debut + i for i in range(5)]

        # Filtrer les comptes d'investissement (id_type_compte = 2 pour 'depense-Investissements')
        comptes_investissement = Comptes.objects.filter(id_type_compte=2)

        # Récupérer les budgets associés aux années successives
        budgets = Budget.objects.filter(
            code_programme=code_programme,
            annee__in=annees,
            id_compte__in=comptes_investissement
        )

        # Annoter et trier les budgets si nécessaire
        if tri == 'montant':
            budgets = budgets.annotate(total_montant=Sum('montant')).order_by('-total_montant')
        elif tri == 'compte':
            budgets = budgets.order_by('id_compte')

        # Récupérer les données d'amenagement_budget pour toutes les années
        amenagements = AmenagementBudget.objects.filter(annee__in=annees)

        # Préparer les résultats pour chaque année
        resultat = []

        for annee in annees:
            # Filtrer les budgets pour l'année actuelle
            budgets_par_annee = budgets.filter(annee=annee)

            if budgets_par_annee.exists():
                for budget in budgets_par_annee:
                    # Calculer le total des attachements pour ce budget
                    total_attachements = ModificationSuppressionBudget.objects.filter(id_budget=budget.id_budget).aggregate(
                        total_attach=Sum(
                            Case(
                                When(attach1__isnull=True, then=Value(0)),
                                default=F('attach1'),
                                output_field=models.DecimalField()
                            )
                            + Case(
                                When(attach2__isnull=True, then=Value(0)),
                                default=F('attach2'),
                                output_field=models.DecimalField()
                            )
                        )
                    )['total_attach'] or 0

                    # Calculer les modifications pour ce budget
                    modif_plus = amenagements.filter(id_budget=budget.id_budget).aggregate(Sum('modif_plus'))['modif_plus__sum'] or 0
                    modif_moins = amenagements.filter(id_budget=budget.id_budget).aggregate(Sum('modif_moins'))['modif_moins__sum'] or 0
                    montant_apres_modification = budget.montant + modif_plus - modif_moins

                    # Récupérer le code_compte depuis la table 'comptes'
                    code_compte = budget.id_compte.code  # Champ 'code' de la table 'comptes'

                    # Calculer le 'credit'
                    credit = budget.montant + total_attachements + modif_plus - modif_moins

                    # Ajouter les résultats pour cette année et ce budget
                    resultat.append({
                        'annee': annee,
                        'programme': code_programme,
                        'compte': budget.id_compte.id_compte,
                        'code_compte': code_compte,
                        'libelle': budget.id_compte.libelle,
                        'montant': budget.montant,
                        'montant_apres_modification': montant_apres_modification,
                        'total_attachements': total_attachements,
                        'modif_plus': modif_plus,
                        'modif_moins': modif_moins,
                        'credit': credit,
                    })
            else:
                # Ajouter une entrée par défaut pour l'année
                resultat.append({
                    'annee': annee,
                    'programme': code_programme,
                    'compte': None,
                    'code_compte': None,
                    'libelle': None,
                    'montant': 0,
                    'montant_apres_modification': 0,
                    'total_attachements': 0,
                    'modif_plus': 0,
                    'modif_moins': 0,
                    'credit': 0,
                })

        # Retourner les résultats
        return Response(resultat)




class VisualisationInvestissementMensuelle(APIView):
    def get(self, request):
        # Récupérer les paramètres de la requête
        code_programme = request.query_params.get('code_programme')
        annee = request.query_params.get('annee')
        tri = request.query_params.get('tri')

        # Vérification des paramètres
        if not code_programme or not annee or not tri:
            return Response({"error": "Tous les paramètres sont nécessaires (code_programme, annee, tri)"}, status=400)

        # Convertir annee en entier
        annee = int(annee)

        # Créer une liste des mois de l'année
        mois = [f'{i:02d}' for i in range(1, 13)]  # Mois format '01', '02', ..., '12'

        # Filtrer les comptes d'investissement (id_type_compte = 2 pour 'depense-Investissements')
        comptes_investissement = Comptes.objects.filter(id_type_compte=2)

        # Précharger les objets AmenagementBudget
        amenagements_prefetch = AmenagementBudget.objects.filter(date_programme_emploi__year=annee)
        prefetch_amenagements = Prefetch('amenagementbudget_set', queryset=amenagements_prefetch, to_attr='amenagements')

        # Récupérer les budgets pour l'année spécifiée
        budgets = Budget.objects.filter(
            code_programme=code_programme,
            annee=annee,
            id_compte__in=comptes_investissement
        ).prefetch_related(prefetch_amenagements)

        # Annoter et trier les budgets si nécessaire
        if tri == 'montant':
            budgets = budgets.annotate(total_montant=Sum('montant')).order_by('-total_montant')
        elif tri == 'compte':
            budgets = budgets.order_by('id_compte')

        # Préparer les résultats pour chaque mois
        resultat = []

        for mois_str in mois:
            # Convertir le mois en entier pour la comparaison avec le champ de la date
            mois_int = int(mois_str)

            # Filtrer les budgets pour le mois actuel
            for budget in budgets:
                amenagement_budget = [ab for ab in budget.amenagements if ab.date_programme_emploi.month == mois_int]

                if amenagement_budget:
                    for ab in amenagement_budget:
                        total_attachements = ModificationSuppressionBudget.objects.filter(id_budget=budget.id_budget).aggregate(
                            total_attach=Sum(
                                Case(
                                    When(attach1__isnull=True, then=Value(0)),
                                    default=F('attach1'),
                                    output_field=models.DecimalField()
                                )
                                + Case(
                                    When(attach2__isnull=True, then=Value(0)),
                                    default=F('attach2'),
                                    output_field=models.DecimalField()
                                )
                            )
                        )['total_attach'] or 0

                        modif_plus = ab.modif_plus or 0
                        modif_moins = ab.modif_moins or 0
                        montant_apres_modification = budget.montant + modif_plus - modif_moins

                        # Récupérer le code_compte depuis la table 'comptes'
                        code_compte = budget.id_compte.code  # Champ 'code' de la table 'comptes'

                        # Calculer le 'credit'
                        credit = budget.montant + total_attachements + modif_plus - modif_moins

                        # Ajouter les résultats pour ce mois et ce budget
                        resultat.append({
                            'mois': mois_str,
                            'annee': annee,
                            'programme': code_programme,
                            'compte': budget.id_compte.id_compte,
                            'code_compte': code_compte,
                            'libelle': budget.id_compte.libelle,
                            'montant': budget.montant,
                            'montant_apres_modification': montant_apres_modification,
                            'total_attachements': total_attachements,
                            'modif_plus': modif_plus,
                            'modif_moins': modif_moins,
                            'credit': credit,
                        })
                else:
                    # Ajouter une entrée par défaut pour le mois
                    resultat.append({
                        'mois': mois_str,
                        'annee': annee,
                        'programme': code_programme,
                        'compte': None,
                        'code_compte': None,
                        'libelle': None,
                        'montant': 0,
                        'montant_apres_modification': 0,
                        'total_attachements': 0,
                        'modif_plus': 0,
                        'modif_moins': 0,
                        'credit': 0,
                    })

        # Retourner les résultats
        return Response(resultat)








class VisualisationFonctionnement(APIView):
    def get(self, request):
        # Récupérer les paramètres de la requête
        code_programme = request.query_params.get('code_programme')
        annee = request.query_params.get('annee')
        tri = request.query_params.get('tri')

        # Vérification des paramètres
        if not code_programme or not annee or not tri:
            return Response({"error": "Tous les paramètres sont nécessaires (code_programme, annee, tri)"}, status=400)

        # Filtrer les comptes d'investissement (id_type_compte = 2 pour 'depense-Investissements')
        comptes_investissement = Comptes.objects.filter(id_type_compte=3)

        # Filtrer les budgets associés aux comptes d'investissement
        budgets = Budget.objects.filter(code_programme=code_programme, annee=annee, id_compte__in=comptes_investissement)

        # Joindre les autres informations nécessaires (par exemple, montant du budget, modif, etc.)
        if tri == 'montant':
            # Tri par montant
            budgets = budgets.annotate(total_montant=Sum('montant')).order_by('-total_montant')
        elif tri == 'compte':
            # Tri par compte
            budgets = budgets.order_by('id_compte')

        # Récupérer les données de PTA associées au budget
        pta = PTA.objects.filter(code_programme=code_programme, annee=annee)

        # Récupérer les données d'amenagement_budget
        amenagements = AmenagementBudget.objects.filter(annee=annee)

        # Fusionner et structurer les résultats sous forme d'une liste
        results = []
        for budget in budgets:
            # Calculer le total des attachements pour ce budget
            total_attachements = ModificationSuppressionBudget.objects.filter(id_budget=budget.id_budget).aggregate(
                total_attach=Sum(
                    Case(
                        When(attach1__isnull=True, then=Value(0)),
                        default=F('attach1'),
                        output_field=models.DecimalField()
                    ) +
                    Case(
                        When(attach2__isnull=True, then=Value(0)),
                        default=F('attach2'),
                        output_field=models.DecimalField()
                    ) +
                    # Ajoutez ici les autres champs attach3 à attach20...
                    Case(
                        When(attach20__isnull=True, then=Value(0)),
                        default=F('attach20'),
                        output_field=models.DecimalField()
                    )
                )
            )['total_attach'] or 0

            # Calculer le montant après modification
            modif_plus = amenagements.filter(id_budget=budget.id_budget).aggregate(Sum('modif_plus'))['modif_plus__sum'] or 0
            modif_moins = amenagements.filter(id_budget=budget.id_budget).aggregate(Sum('modif_moins'))['modif_moins__sum'] or 0
            montant_apres_modification = budget.montant + modif_plus - modif_moins

            # Récupérer le code_compte depuis la table 'comptes'
            code_compte = budget.id_compte.code  # Champ 'code' de la table 'comptes'

            # Calculer le 'credit' basé sur une logique, par exemple, utiliser le montant et les modifications
            credit = budget.montant + total_attachements + modif_plus - modif_moins

            # Créer une structure de résultat pour chaque budget
            result = {
                'programme': budget.code_programme,
                'compte': budget.id_compte.id_compte,  # Renvoie l'ID du compte
                'code_compte': code_compte,  # Ajoutez le code du compte
                'libelle': budget.libelle,
                'montant': budget.montant,
                'montant_apres_modification': montant_apres_modification,
                'total_attachements': total_attachements,
                'modif_plus': modif_plus,
                'modif_moins': modif_moins,
                'credit': credit,  # Calcul du crédit
                'pta': pta.filter(code_programme=budget.code_programme).values('libelle', 'montant'),
            }
            results.append(result)

        # Retourner les résultats
        return Response(results)


class VisualisationFonctionnement5ans(APIView):
    def get(self, request):
        # Récupérer les paramètres de la requête
        code_programme = request.query_params.get('code_programme')
        annee_debut = request.query_params.get('annee')
        tri = request.query_params.get('tri')

        # Vérification des paramètres
        if not code_programme or not annee_debut or not tri:
            return Response({"error": "Tous les paramètres sont nécessaires (code_programme, annee, tri)"}, status=400)

        # Convertir annee_debut en entier
        annee_debut = int(annee_debut)

        # Créer une liste des 5 années successives
        annees = [annee_debut + i for i in range(5)]

        # Filtrer les comptes de fonctionnement (id_type_compte = 3 pour 'dépenses de fonctionnement')
        comptes_fonctionnement = Comptes.objects.filter(id_type_compte=3)

        # Récupérer les budgets associés aux années successives
        budgets = Budget.objects.filter(
            code_programme=code_programme,
            annee__in=annees,
            id_compte__in=comptes_fonctionnement
        )

        # Annoter et trier les budgets si nécessaire
        if tri == 'montant':
            budgets = budgets.annotate(total_montant=Sum('montant')).order_by('-total_montant')
        elif tri == 'compte':
            budgets = budgets.order_by('id_compte')

        # Récupérer les données d'amenagement_budget pour toutes les années
        amenagements = AmenagementBudget.objects.filter(annee__in=annees)

        # Préparer les résultats pour chaque année
        resultat = []

        for annee in annees:
            # Filtrer les budgets pour l'année actuelle
            budgets_par_annee = budgets.filter(annee=annee)

            if budgets_par_annee.exists():
                for budget in budgets_par_annee:
                    # Calculer le total des attachements pour ce budget
                    total_attachements = ModificationSuppressionBudget.objects.filter(id_budget=budget.id_budget).aggregate(
                        total_attach=Sum(
                            Case(
                                When(attach1__isnull=True, then=Value(0)),
                                default=F('attach1'),
                                output_field=models.DecimalField()
                            ) +
                            Case(
                                When(attach2__isnull=True, then=Value(0)),
                                default=F('attach2'),
                                output_field=models.DecimalField()
                            )
                        )
                    )['total_attach'] or 0

                    # Calculer les modifications pour ce budget
                    modif_plus = amenagements.filter(id_budget=budget.id_budget).aggregate(Sum('modif_plus'))['modif_plus__sum'] or 0
                    modif_moins = amenagements.filter(id_budget=budget.id_budget).aggregate(Sum('modif_moins'))['modif_moins__sum'] or 0
                    montant_apres_modification = budget.montant + modif_plus - modif_moins

                    # Récupérer le code_compte depuis la table 'comptes'
                    code_compte = budget.id_compte.code  # Champ 'code' de la table 'comptes'

                    # Calculer le 'credit'
                    credit = budget.montant + total_attachements + modif_plus - modif_moins

                    # Ajouter les résultats pour cette année et ce budget
                    resultat.append({
                        'annee': annee,
                        'programme': code_programme,
                        'compte': budget.id_compte.id_compte,
                        'code_compte': code_compte,
                        'libelle': budget.id_compte.libelle,
                        'montant': budget.montant,
                        'montant_apres_modification': montant_apres_modification,
                        'total_attachements': total_attachements,
                        'modif_plus': modif_plus,
                        'modif_moins': modif_moins,
                        'credit': credit,
                    })
            else:
                # Ajouter une entrée par défaut pour l'année
                resultat.append({
                    'annee': annee,
                    'programme': code_programme,
                    'compte': None,
                    'code_compte': None,
                    'libelle': None,
                    'montant': 0,
                    'montant_apres_modification': 0,
                    'total_attachements': 0,
                    'modif_plus': 0,
                    'modif_moins': 0,
                    'credit': 0,
                })

        # Retourner les résultats
        return Response(resultat)


class VisualisationFonctionnementMensuelle(APIView):
    def get(self, request):
        # Récupérer les paramètres de la requête
        code_programme = request.query_params.get('code_programme')
        annee = request.query_params.get('annee')
        tri = request.query_params.get('tri')

        # Vérification des paramètres
        if not code_programme or not annee or not tri:
            return Response({"error": "Tous les paramètres sont nécessaires (code_programme, annee, tri)"}, status=400)

        # Convertir annee en entier
        annee = int(annee)

        # Créer une liste des mois de l'année
        mois = [f'{i:02d}' for i in range(1, 13)]  # Mois format '01', '02', ..., '12'

        # Filtrer les comptes d'investissement (id_type_compte = 2 pour 'depense-Investissements')
        comptes_investissement = Comptes.objects.filter(id_type_compte=3)

        # Précharger les objets AmenagementBudget
        amenagements_prefetch = AmenagementBudget.objects.filter(date_programme_emploi__year=annee)
        prefetch_amenagements = Prefetch('amenagementbudget_set', queryset=amenagements_prefetch, to_attr='amenagements')

        # Récupérer les budgets pour l'année spécifiée
        budgets = Budget.objects.filter(
            code_programme=code_programme,
            annee=annee,
            id_compte__in=comptes_investissement
        ).prefetch_related(prefetch_amenagements)

        # Annoter et trier les budgets si nécessaire
        if tri == 'montant':
            budgets = budgets.annotate(total_montant=Sum('montant')).order_by('-total_montant')
        elif tri == 'compte':
            budgets = budgets.order_by('id_compte')

        # Préparer les résultats pour chaque mois
        resultat = []

        for mois_str in mois:
            # Convertir le mois en entier pour la comparaison avec le champ de la date
            mois_int = int(mois_str)

            # Filtrer les budgets pour le mois actuel
            for budget in budgets:
                amenagement_budget = [ab for ab in budget.amenagements if ab.date_programme_emploi.month == mois_int]

                if amenagement_budget:
                    for ab in amenagement_budget:
                        total_attachements = ModificationSuppressionBudget.objects.filter(id_budget=budget.id_budget).aggregate(
                            total_attach=Sum(
                                Case(
                                    When(attach1__isnull=True, then=Value(0)),
                                    default=F('attach1'),
                                    output_field=models.DecimalField()
                                )
                                + Case(
                                    When(attach2__isnull=True, then=Value(0)),
                                    default=F('attach2'),
                                    output_field=models.DecimalField()
                                )
                            )
                        )['total_attach'] or 0

                        modif_plus = ab.modif_plus or 0
                        modif_moins = ab.modif_moins or 0
                        montant_apres_modification = budget.montant + modif_plus - modif_moins

                        # Récupérer le code_compte depuis la table 'comptes'
                        code_compte = budget.id_compte.code  # Champ 'code' de la table 'comptes'

                        # Calculer le 'credit'
                        credit = budget.montant + total_attachements + modif_plus - modif_moins

                        # Ajouter les résultats pour ce mois et ce budget
                        resultat.append({
                            'mois': mois_str,
                            'annee': annee,
                            'programme': code_programme,
                            'compte': budget.id_compte.id_compte,
                            'code_compte': code_compte,
                            'libelle': budget.id_compte.libelle,
                            'montant': budget.montant,
                            'montant_apres_modification': montant_apres_modification,
                            'total_attachements': total_attachements,
                            'modif_plus': modif_plus,
                            'modif_moins': modif_moins,
                            'credit': credit,
                        })
                else:
                    # Ajouter une entrée par défaut pour le mois
                    resultat.append({
                        'mois': mois_str,
                        'annee': annee,
                        'programme': code_programme,
                        'compte': None,
                        'code_compte': None,
                        'libelle': None,
                        'montant': 0,
                        'montant_apres_modification': 0,
                        'total_attachements': 0,
                        'modif_plus': 0,
                        'modif_moins': 0,
                        'credit': 0,
                    })

        # Retourner les résultats
        return Response(resultat)


class BudgetParCompte(APIView):
    def get(self, request):
        # Récupérer les paramètres de la requête
        compte = request.query_params.get('compte')
        annee = request.query_params.get('annee')

        # Vérification des paramètres
        if not compte or not annee:
            return Response({"error": "Les paramètres compte et annee sont nécessaires."}, status=400)

        # Récupérer les comptes d'investissement
        comptes_investissement = Comptes.objects.filter(id_compte=compte)

        # Filtrer les budgets associés aux comptes d'investissement
        budgets = Budget.objects.filter(code_programme__isnull=False, annee=annee, id_compte__in=comptes_investissement)

        # Récupérer les données d'amenagement_budget
        amenagements = AmenagementBudget.objects.filter(annee=annee)

        # Calculer les informations par budget
        results = []
        for budget in budgets:
            # Calculer le total des attachements pour ce budget
            total_attachements = ModificationSuppressionBudget.objects.filter(id_budget=budget.id_budget).aggregate(
                total_attach=Sum(
                    Case(
                        When(attach1__isnull=True, then=Value(0)),
                        default=F('attach1'),
                        output_field=models.DecimalField()
                    ) +
                    Case(
                        When(attach2__isnull=True, then=Value(0)),
                        default=F('attach2'),
                        output_field=models.DecimalField()
                    ) +
                    # Ajoutez les autres attach... ici si nécessaire
                    Case(
                        When(attach20__isnull=True, then=Value(0)),
                        default=F('attach20'),
                        output_field=models.DecimalField()
                    )
                )
            )['total_attach'] or 0

            # Calculer les montants après modification
            modif_plus = amenagements.filter(id_budget=budget.id_budget).aggregate(Sum('modif_plus'))['modif_plus__sum'] or 0
            modif_moins = amenagements.filter(id_budget=budget.id_budget).aggregate(Sum('modif_moins'))['modif_moins__sum'] or 0
            montant_apres_modification = budget.montant + modif_plus - modif_moins

            # Créer une structure de résultat pour chaque budget
            result = {
                'programme': budget.code_programme,
                'compte': budget.id_compte.code,  # L'ID du compte
                'libelle': budget.libelle,
                'montant': budget.montant,
                'montant_apres_modification': montant_apres_modification,
                'total_attachements': total_attachements,
                'modif_plus': modif_plus,
                'modif_moins': modif_moins,
            }
            results.append(result)

        # Retourner les résultats sous forme de réponse JSON
        return Response(results)




class TableauEquilibreFinancier(APIView):
    def get(self, request):
        # Récupération de l'année depuis les paramètres
        annee = request.query_params.get('annee', None)
        if not annee:
            return Response({"error": "L'année est requise."}, status=400)

        conn = psycopg2.connect(
            dbname="controle_gestion",
            user="postgres",
            password="tatamo",
            host="localhost",
            port="5432"
        )
        cursor = conn.cursor()
        comptes_depense_fonctionnement = """
            SELECT c.code, SUM(msb.attach1+ msb.attach2 + msb.attach3+ msb.attach4+ msb.attach5+ msb.attach6+ msb.attach7+ msb.attach8+ msb.attach9+ msb.attach10+ msb.attach11+ msb.attach12+ msb.attach13+ msb.attach14+ msb.attach15+ msb.attach16+ msb.attach17+ msb.attach18+ msb.attach19+ msb.attach20) 
            AS total_attachements
            FROM comptes c
            JOIN modification_suppression_budget msb ON msb.id_compte = c.id_compte
            WHERE c.id_type_compte = 3
            GROUP BY c.code 
        """
        comptes_depense_investissement = """
            SELECT c.code, SUM(msb.attach1+ msb.attach2 + msb.attach3+ msb.attach4+ msb.attach5+ msb.attach6+ msb.attach7+ msb.attach8+ msb.attach9+ msb.attach10+ msb.attach11+ msb.attach12+ msb.attach13+ msb.attach14+ msb.attach15+ msb.attach16+ msb.attach17+ msb.attach18+ msb.attach19+ msb.attach20 ) 
            AS total_attachements
            FROM comptes c
            JOIN modification_suppression_budget msb ON msb.id_compte = c.id_compte
            WHERE c.id_type_compte = 2
            GROUP BY c.code 
         """  
        comptes_recette = """
            SELECT c.code, SUM(msb.attach1+ msb.attach2 + msb.attach3+ msb.attach4+ msb.attach5+ msb.attach6+ msb.attach7+ msb.attach8+ msb.attach9+ msb.attach10+ msb.attach11+ msb.attach12+ msb.attach13+ msb.attach14+ msb.attach15+ msb.attach16+ msb.attach17+ msb.attach18+ msb.attach19+ msb.attach20) 
            AS total_attachements
            FROM comptes c
            JOIN modification_suppression_budget msb ON msb.id_compte = c.id_compte
            WHERE c.id_type_compte = 1
            GROUP BY c.code 
        """
        cursor.execute(comptes_depense_fonctionnement)
        cursor.execute(comptes_depense_investissement)
        cursor.execute(comptes_recette)

        comptes_depense_fonctionnement = cursor.fetchall()
        fonctionnement = [{"code": row[0], "total_attachements": row[1]} for row in comptes_depense_fonctionnement]
        
        comptes_depense_investissement = cursor.fetchall()
        investissement = [{"code": row[0], "total_attachements": row[1]} for row in comptes_depense_investissement]
        
        comptes_recette= cursor.fetchall()
        recette = [{"code": row[0], "total_attachements": row[1]} for row in comptes_recette]
       
        try:
            
           
            # Récupérer le revenu total (montant des budgets) pour l'année spécifiée
            revenue = Budget.objects.filter(annee=annee).aggregate(total_revenue=Sum('montant'))['total_revenue'] or 0

            # Récupérer les dépenses d'investissement depuis modification_suppression_budget
            investment_expenses = ModificationSuppressionBudget.objects.filter(
                annee_modification=annee
            ).aggregate(total_investment=Sum(
                'avance') + Sum('remb_garantie') + Sum('attach1') + Sum('attach2') +
                Sum('attach3') + Sum('attach4') + Sum('attach5') + Sum('attach6') + Sum('attach7')
                + Sum('attach8') + Sum('attach9') + Sum('attach10') + Sum('attach11') + Sum('attach12') + Sum('attach13') + Sum('attach14')
                + Sum('attach15') + Sum('attach16') + Sum('attach17') + Sum('attach18') + Sum('attach19') + Sum('attach20')
                
            )['total_investment'] or 0

            # Récupérer les dépenses opérationnelles depuis amenagement_budget
            operating_expenses = AmenagementBudget.objects.filter(annee=annee).aggregate(
                total_operational=(Sum('modif_plus') - Sum('modif_moins'))
            )['total_operational'] or 0

            # Calcul des ajustements (par exemple, modif_plus et modif_moins)
            adjustments = AmenagementBudget.objects.filter(annee=annee).aggregate(
                total_adjustments=(Sum('modif_plus') + Sum('modif_moins'))
            )['total_adjustments'] or 0

            # Calcul des métriques financières
            total_expenses = investment_expenses + operating_expenses
            balance = revenue - total_expenses
            total_rec_dep = revenue - total_expenses + adjustments
            rec_dep_positif = total_rec_dep if total_rec_dep > 0 else 0
            rec_dep_negatif = -total_rec_dep if total_rec_dep < 0 else 0
            solde = total_rec_dep  # Total après ajustements

            # Formater les résultats
            data = {
                "depenses_fonctionnement": fonctionnement,
                "depenses_investissemt" : investissement,
                "recettes" : recette,
                "annee": annee,
                "revenue": revenue,
                "investment_expenses": investment_expenses,
                "operating_expenses": operating_expenses,
                "adjustments": adjustments,
                "total_expenses": total_expenses,
                "balance": balance,
                "rec_dep_positif": rec_dep_positif,
                "rec_dep_negatif": rec_dep_negatif,
                "solde": solde
            }

            cursor.close()
            conn.close()


            return Response(data, status=200)

        except Exception as e:
            return Response({"error": f"Une erreur s'est produite: {str(e)}"}, status=500)




class ExportPDFTableauEquilibreFinancier(APIView):
    def get(self, request):
        # Récupération de l'année depuis les paramètres
        annee = request.query_params.get('annee', None)
        if not annee:
            return Response({"error": "L'année est requise."}, status=400)

        conn = psycopg2.connect(
            dbname="controle_gestion",
            user="postgres",
            password="tatamo",
            host="localhost",
            port="5432"
        )
        cursor = conn.cursor()
        comptes_depense_fonctionnement = """
            SELECT c.code, SUM(msb.attach1+ msb.attach2 + msb.attach3+ msb.attach4+ msb.attach5+ msb.attach6+ msb.attach7+ msb.attach8+ msb.attach9+ msb.attach10+ msb.attach11+ msb.attach12+ msb.attach13+ msb.attach14+ msb.attach15+ msb.attach16+ msb.attach17+ msb.attach18+ msb.attach19+ msb.attach20) 
            AS total_attachements
            FROM comptes c
            JOIN modification_suppression_budget msb ON msb.id_compte = c.id_compte
            WHERE c.id_type_compte = 3
            GROUP BY c.code 
        """
        comptes_depense_investissement = """
            SELECT c.code, SUM(msb.attach1+ msb.attach2 + msb.attach3+ msb.attach4+ msb.attach5+ msb.attach6+ msb.attach7+ msb.attach8+ msb.attach9+ msb.attach10+ msb.attach11+ msb.attach12+ msb.attach13+ msb.attach14+ msb.attach15+ msb.attach16+ msb.attach17+ msb.attach18+ msb.attach19+ msb.attach20 ) 
            AS total_attachements
            FROM comptes c
            JOIN modification_suppression_budget msb ON msb.id_compte = c.id_compte
            WHERE c.id_type_compte = 2
            GROUP BY c.code 
         """  
        comptes_recette = """
            SELECT c.code, SUM(msb.attach1+ msb.attach2 + msb.attach3+ msb.attach4+ msb.attach5+ msb.attach6+ msb.attach7+ msb.attach8+ msb.attach9+ msb.attach10+ msb.attach11+ msb.attach12+ msb.attach13+ msb.attach14+ msb.attach15+ msb.attach16+ msb.attach17+ msb.attach18+ msb.attach19+ msb.attach20) 
            AS total_attachements
            FROM comptes c
            JOIN modification_suppression_budget msb ON msb.id_compte = c.id_compte
            WHERE c.id_type_compte = 1
            GROUP BY c.code 
        """
        cursor.execute(comptes_depense_fonctionnement)
        cursor.execute(comptes_depense_investissement)
        cursor.execute(comptes_recette)

        comptes_depense_fonctionnement = cursor.fetchall()
        fonctionnement = [{"code": row[0], "total_attachements": row[1]} for row in comptes_depense_fonctionnement]
        
        comptes_depense_investissement = cursor.fetchall()
        investissement = [{"code": row[0], "total_attachements": row[1]} for row in comptes_depense_investissement]
        
        comptes_recette= cursor.fetchall()
        recette = [{"code": row[0], "total_attachements": row[1]} for row in comptes_recette]
       
        try:
            
           
            # Récupérer le revenu total (montant des budgets) pour l'année spécifiée
            revenue = Budget.objects.filter(annee=annee).aggregate(total_revenue=Sum('montant'))['total_revenue'] or 0

            # Récupérer les dépenses d'investissement depuis modification_suppression_budget
            investment_expenses = ModificationSuppressionBudget.objects.filter(
                annee_modification=annee
            ).aggregate(total_investment=Sum(
                'avance') + Sum('remb_garantie') + Sum('attach1') + Sum('attach2') +
                Sum('attach3') + Sum('attach4') + Sum('attach5') + Sum('attach6') + Sum('attach7')
                + Sum('attach8') + Sum('attach9') + Sum('attach10') + Sum('attach11') + Sum('attach12') + Sum('attach13') + Sum('attach14')
                + Sum('attach15') + Sum('attach16') + Sum('attach17') + Sum('attach18') + Sum('attach19') + Sum('attach20')
                
            )['total_investment'] or 0

            # Récupérer les dépenses opérationnelles depuis amenagement_budget
            operating_expenses = AmenagementBudget.objects.filter(annee=annee).aggregate(
                total_operational=(Sum('modif_plus') - Sum('modif_moins'))
            )['total_operational'] or 0

            # Calcul des ajustements (par exemple, modif_plus et modif_moins)
            adjustments = AmenagementBudget.objects.filter(annee=annee).aggregate(
                total_adjustments=(Sum('modif_plus') + Sum('modif_moins'))
            )['total_adjustments'] or 0

            # Calcul des métriques financières
            total_expenses = investment_expenses + operating_expenses
            balance = revenue - total_expenses
            total_rec_dep = revenue - total_expenses + adjustments
            rec_dep_positif = total_rec_dep if total_rec_dep > 0 else 0
            rec_dep_negatif = -total_rec_dep if total_rec_dep < 0 else 0
            solde = total_rec_dep  # Total après ajustements

            # Formater les résultats
            data = {
                "depenses_fonctionnement": fonctionnement,
                "depenses_investissemt" : investissement,
                "recettes" : recette,
                "annee": annee,
                "revenue": revenue,
                "investment_expenses": investment_expenses,
                "operating_expenses": operating_expenses,
                "adjustments": adjustments,
                "total_expenses": total_expenses,
                "balance": balance,
                "rec_dep_positif": rec_dep_positif,
                "rec_dep_negatif": rec_dep_negatif,
                "solde": solde
            }

            cursor.close()
            conn.close()


            return Response(data, status=200)

        except Exception as e:
            return Response({"error": f"Une erreur s'est produite: {str(e)}"}, status=500)


    def post(self, request):
        annee = request.query_params.get('annee', None)
        if not annee:
            return Response({"error": "L'année est requise."}, status=400)

        context = {
            'annee': annee,
            'revenue': revenue,
            'investment_expenses': investment_expenses,
            'operating_expenses': operating_expenses,
            'adjustments': adjustments,
            'total_expenses': total_expenses,
            'balance': balance,
            'rec_dep_positif': rec_dep_positif,
            'rec_dep_negatif': rec_dep_negatif,
            'solde': solde
        }

        # Générer le contenu HTML
        html_string = render_to_string('tableau_equilibre_financier.html', context)

        # Convertir HTML en PDF avec xhtml2pdf
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="tableau_equilibre_financier.pdf"'
        pisa_status = pisa.CreatePDF(html_string, dest=response)
        
        if pisa_status.err:
            return HttpResponse('Error generating PDF', status=400)
        return response



class DecaissementParProjet(APIView):
    def get(self, request, annee):
        # Récupérer les décaissements pour l'année donnée
        try:
            # Récupérer les budgets de l'année
            budgets = Budget.objects.filter(annee=annee)

            # Liste pour stocker les résultats
            result = []

            for budget in budgets:
                # Récupérer les objets associés (AmenagementBudget et ModificationSuppressionBudget)
                amenagement = AmenagementBudget.objects.filter(id_budget=budget.id_budget, annee=annee).first()
                modification = ModificationSuppressionBudget.objects.filter(id_budget=budget.id_budget, annee_modification=annee).first()

                if amenagement and modification:
                    # Calculer le décaissement pour chaque projet
                    decaissement = amenagement.modif_plus - amenagement.modif_moins + modification.avance
                    
                    # Ajouter les informations sérialisables dans le résultat
                    result.append({
                        'compte': budget.id_compte.code,  # Remplacer par un attribut sérialisable de 'compte'
                        'libelle': budget.libelle,
                        'decaissement': decaissement
                    })

            # Retourner la réponse sous forme JSON
            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SituationBudgetaire(APIView):
    def get(self, request, annee):
        try:
            # Récupérer les budgets pour l'année donnée
            budgets = Budget.objects.filter(annee=annee).select_related('id_compte')

            # Préparer les champs d'attachement à inclure dans les calculs
            attach_fields = [f'modificationsuppressionbudget__attach{i}' for i in range(1, 21)]

            # Calculer les réalisations et disponibilités
            data = budgets.values(
                'id_compte__code',    # Code du compte
                'id_compte__libelle', # Libellé du compte
                'montant'             # Montant du budget
            ).annotate(
                # Réalisation : somme des avances, remboursements et attachements
                realisation=Cast(
                    Sum(Case(When(modificationsuppressionbudget__avance__isnull=False, then='modificationsuppressionbudget__avance'), default=Value(0), output_field=DecimalField())) +
                    Sum(Case(When(modificationsuppressionbudget__remb_garantie__isnull=False, then='modificationsuppressionbudget__remb_garantie'), default=Value(0), output_field=DecimalField())) +
                    sum([
                        Sum(Case(When(**{f'{field}__isnull': False, 'then': field}), default=Value(0), output_field=DecimalField()))
                        for field in attach_fields
                    ]), DecimalField(max_digits=12, decimal_places=2)
                ),
                # Disponibilité : montant - réalisations
                disponible=Cast(
                    F('montant') - (
                        Sum(Case(When(modificationsuppressionbudget__avance__isnull=False, then='modificationsuppressionbudget__avance'), default=Value(0), output_field=DecimalField())) +
                        Sum(Case(When(modificationsuppressionbudget__remb_garantie__isnull=False, then='modificationsuppressionbudget__remb_garantie'), default=Value(0), output_field=DecimalField())) +
                        sum([
                            Sum(Case(When(**{f'{field}__isnull': False, 'then': field}), default=Value(0), output_field=DecimalField()))
                            for field in attach_fields
                        ])
                    ), DecimalField(max_digits=12, decimal_places=2)
                )
            )

            # Formater les résultats
            result = [
                {
                    "code": item['id_compte__code'],
                    "libelle": item['id_compte__libelle'],
                    "montant": item['montant'],
                    "realisation": item['realisation'],
                    "disponible": item['disponible']
                }
                for item in data
            ]

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AnalyseDesEcarts(APIView):
    def get(self, request, annee):
        try:
            # Récupérer les budgets pour l'année donnée
            budgets = Budget.objects.filter(annee=annee).select_related('id_compte')

            # Préparer les champs d'attachement à inclure dans les calculs
            attach_fields = [f'modificationsuppressionbudget__attach{i}' for i in range(1, 21)]

            # Calculer les réalisations pour chaque compte
            data = budgets.values(
                'id_compte__code',    # Code du compte
                'id_compte__libelle', # Libellé du compte
                'montant'             # Montant du budget
            ).annotate(
                # Réalisation : somme des avances, remboursements et attachements
                realisation=Cast(
                    Sum(Case(When(modificationsuppressionbudget__avance__isnull=False, then='modificationsuppressionbudget__avance'), default=Value(0), output_field=DecimalField())) +
                    Sum(Case(When(modificationsuppressionbudget__remb_garantie__isnull=False, then='modificationsuppressionbudget__remb_garantie'), default=Value(0), output_field=DecimalField())) +
                    sum([ 
                        Sum(Case(When(**{f'{field}__isnull': False, 'then': field}), default=Value(0), output_field=DecimalField())) 
                        for field in attach_fields
                    ]), DecimalField(max_digits=12, decimal_places=2)
                ),
            )

            # Formater les résultats avec les calculs de l'écart et du taux de réalisation
            result = [
                {
                    "compte": item['id_compte__code'],
                    "libelle": item['id_compte__libelle'],
                    "budget": item['montant'],
                    "realisation": item['realisation'],
                    "ecart": item['realisation'] - item['montant'],
                    "tauxRealisation": round((item['realisation'] / item['montant']) * 100, 2) if item['montant'] != 0 else 0,
                }
                for item in data
            ]

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class VariationGlobale(APIView):
    def get(self, request, annee):
        # Exemple de récupération des données pour l'année donnée
        try:
            # Filtrage des données pour l'année donnée
            budget_data = Budget.objects.filter(annee=annee)

            # Utilisation de CASE WHEN pour gérer les valeurs nulles
            result = budget_data.annotate(
                modif_moins=Sum(
                    Case(
                        When(amenagementbudget__modif_moins__isnull=True, then=Value(0)),
                        default='amenagementbudget__modif_moins',
                        output_field=IntegerField()
                    )
                ),
                modif_plus=Sum(
                    Case(
                        When(amenagementbudget__modif_plus__isnull=True, then=Value(0)),
                        default='amenagementbudget__modif_plus',
                        output_field=IntegerField()
                    )
                )
            ).values('libelle', 'modif_moins', 'modif_plus')

            # Calcul des totaux pour chaque rubrique
            for item in result:
                item['total'] = item['modif_plus'] - item['modif_moins']

            # Retourner les données sous format JSON
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProgrammeDemploi(APIView):
    def get(self, request, annee):
        # Vérifiez si l'année est fournie
        if not annee:
            return Response({"detail": "L'année est requise."}, status=status.HTTP_400_BAD_REQUEST)

        # Récupérer les budgets pour l'année donnée
        budgets = Budget.objects.filter(annee=annee)
        
        # Joindre avec les tables amenagement_budget pour récupérer les modifications
        programme_emploi = AmenagementBudget.objects.filter(
            id_budget__in=budgets.values('id_budget'),
            annee=annee
        ).select_related('id_budget', 'id_compte')  # Optimisation des jointures

        result = []
        for entry in programme_emploi:
            # Calculer la valeur corrigée pour chaque entrée
            budget = entry.id_budget
            libelle = budget.libelle
            modif_moins = entry.modif_moins
            modif_plus = entry.modif_plus
            budget_initial = budget.montant
            corrige = budget_initial + modif_plus - modif_moins

            result.append({
                "prgme": budget.code_programme,
                "rubrique": libelle,
                "budgetInitial": budget_initial,
                "modifMoins": modif_moins,
                "modifPlus": modif_plus,
                "corrige": corrige,
            })

        return Response(result, status=status.HTTP_200_OK)
