from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import RecetteAllApmf
from .serializers import RecetteAllApmfSerializer
from comptes.models import Comptes  # Correct
from comptes.serializers import ComptesSerializer
from localites.serializers import VilleSerializer
from tiers.serializers import TiersSerializer
from django.http import JsonResponse
from .models import RecetteAllApmf, Ville, Comptes, Tiers
from datetime import date
from django.shortcuts import render
from django.db.models import Q
from django.db.models import Sum
from django.db.models import F, Sum, Case, When, DecimalField, Value, IntegerField
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from django.db.models.functions import ExtractYear, ExtractMonth




class CompteListView(APIView):
    def get(self, request):
        comptes = Compte.objects.filter(id_type_compte=1).exclude(id_compte=2)
        serializer = CompteSerializer(comptes, many=True)
        return Response(serializer.data)

class VilleListView(APIView):
    def get(self, request):
        villes = Ville.objects.all()
        serializer = VilleSerializer(villes, many=True)
        return Response(serializer.data)

class TiersListView(APIView):
    def get(self, request):
        tiers = Tiers.objects.values('id_tiers', 'nom', 'prenoms')
        return Response(tiers)


class RecetteAllApmfListView(APIView):
    def get(self, request):
        recettes = RecetteAllApmf.objects.all()
        serializer = RecetteAllApmfSerializer(recettes, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        print("Données reçues:", request.data)
        

        # Validation des champs requis
        required_fields = ['montant_ht', 'tva', 'montant_ttc', 'id_compte', 'id_ville', 'id_tiers']
        for field in required_fields:
            if field not in data or not data[field]:
                return Response({'error': f'Le champ {field} est requis.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Conversion des champs numériques
            montant_ht = float(data['montant_ht'])
            tva = float(data['tva'])
            montant_ttc = float(data['montant_ttc'])

            # Récupération des objets liés
            id_compte = int(data['id_compte'])
            id_ville = int(data['id_ville'])
            id_tiers_id = data['id_tiers']  # Utilisez cette variable

            # Log avant récupération des objets
            print(f"Essai de récupération des objets avec id_compte={id_compte}, id_ville={id_ville}, id_tiers={id_tiers_id}")

            # Vérifier l'existence des objets dans la base de données
            compte = get_object_or_404(Comptes, id_compte=id_compte)
            ville = get_object_or_404(Ville, id_ville=id_ville)
            tiers = get_object_or_404(Tiers, id_tiers=id_tiers_id)

            # Log des objets récupérés pour vérifier
            print(f"Compte: {compte}, Ville: {ville}, Tiers: {tiers}")

        except ValueError:
            return Response({'error': 'Valeurs invalides pour montant_ht, tva, ou montant_ttc.'},
                            status=status.HTTP_400_BAD_REQUEST)
        except Comptes.DoesNotExist:
            return Response({'error': 'Compte introuvable.'}, status=status.HTTP_400_BAD_REQUEST)
        except Ville.DoesNotExist:
            return Response({'error': 'Ville introuvable.'}, status=status.HTTP_400_BAD_REQUEST)
        except Tiers.DoesNotExist:
            return Response({'error': 'Tiers introuvable.'}, status=status.HTTP_400_BAD_REQUEST)

        # Création de l'objet avec des relations valides
        recette_data = {
            'id_compte': id_compte,  # Passez l'objet complet
            'id_ville': id_ville,    # Passez l'objet complet
            'id_tiers': id_tiers_id,    # Passez l'objet complet
            'taux_tva': data.get('taux_tva', 20),  # Valeur par défaut
            'num_facture': data['num_facture'],
            'libelle': data['libelle'],
            'date_facture': data['date_facture'],
            'montant_ht': montant_ht,
            'tva': tva,
            'montant_ttc': montant_ttc,
        }

        serializer = RecetteAllApmfSerializer(data=recette_data)
        if serializer.is_valid():
            serializer.save()
            # Log des données insérées
            print(f"Recette insérée avec id: {serializer.instance.id_recette_apmf_all}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



        #etat des factures 
    def get(self, request, *args, **kwargs):
        queryset = RecetteAllApmf.objects.all()

        # Récupérer les paramètres de requête
        annee = request.query_params.get('annee', None)
        compte = request.query_params.get('compte', None)
        localite = request.query_params.get('localite', None)

        # Filtrage par année
        if annee:
            queryset = queryset.filter(date_facture__year=annee)

        # Filtrage par compte
        if compte:
            queryset = queryset.filter(id_compte=compte)

        # Filtrage par localité
        if localite:
            queryset = queryset.filter(id_ville=localite)

        # Sérialisation des résultats filtrés
        serializer = RecetteAllApmfSerializer(queryset, many=True)
        return Response(serializer.data)


class TableauSynoptiqueView(APIView):
    def get(self, request):
        # Récupération des paramètres GET
        annee = request.GET.get('anneeSynop')
        localite_id = request.GET.get('localiteSynop')
        tva = request.GET.get('tvaSynop')

        # Validation des paramètres
        if not all([annee, localite_id, tva]):
            return Response({"error": "Tous les paramètres (anneeSynop, localiteSynop, tvaSynop) sont requis."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            annee = int(annee)
            localite_id = int(localite_id)
        except ValueError:
            return Response({"error": "Les paramètres 'anneeSynop' et 'localiteSynop' doivent être des entiers."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Vérifier si la localité existe
        try:
            localite = Ville.objects.get(id_ville=localite_id)
        except Ville.DoesNotExist:
            return Response({"error": "La localité spécifiée n'existe pas."}, status=status.HTTP_404_NOT_FOUND)

        # Déterminer le filtre TVA
        if tva == 'avec':
            tva_filter = F('montant_ht') + F('tva')  # Montant TTC
        elif tva == 'sans':
            tva_filter = F('montant_ht')  # Montant HT uniquement
        else:
            return Response({"error": "Le paramètre 'tvaSynop' doit être 'avec' ou 'sans'."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Exclure les comptes id_compte = 1 ou 2
        recettes = RecetteAllApmf.objects.filter(
            date_facture__year=annee,
            id_ville=localite_id
        ).exclude(
            id_compte__in=[1, 2]
        ).annotate(
            montant_calcul=tva_filter  # Calculer le montant selon TVA
        ).values(
            'id_ville', 'id_compte', 'date_facture__month'
        ).annotate(
            total_montant=Sum('montant_calcul', output_field=DecimalField(max_digits=15, decimal_places=2))
        )

        # Préparer la réponse structurée
        comptes = {}
        for recette in recettes:
            compte_id = recette['id_compte']
            if compte_id not in comptes:
                comptes[compte_id] = 0
            comptes[compte_id] += recette['total_montant']

        result = {
            "localite": {
                "code_ville": localite.code_ville,
                "nom_ville": localite.nom_ville,
            },
            "comptes": comptes,
            "total": sum(comptes.values()),
        }

        # Si aucun montant trouvé
        if result["total"] == 0:
            return Response({"message": "Aucune donnée trouvée pour les critères spécifiés."},
                            status=status.HTTP_404_NOT_FOUND)

        return Response(result, status=status.HTTP_200_OK)


class NumeroStatistiques(APIView):

    def get(self, request):
        # Récupère tous les enregistrements de la table recette_all_apmf
        recettes = RecetteAllApmf.objects.all()
        
        # Crée une liste de dictionnaires avec les informations des factures
        result = []
        for recette in recettes:
            result.append({
                'id_recette_apmf_all': recette.id_recette_apmf_all,
                'num_facture': recette.num_facture
            })
        
        # Retourne les résultats sous forme de réponse JSON
        return Response(result)

class EvolutionMensuelleGlobale(APIView):

    def get(self, request):
        anneeGlobale = request.GET.get('anneeGlobale')
        localiteGlobale = request.GET.get('localiteGlobale')
        tvaGlobale = request.GET.get('tvaGlobale')
        
        if not all([anneeGlobale,localiteGlobale,tvaGlobale]):
            return JsonResponse({"error":"Tous les paramètres(annee,localite, tva) sont requis."}, status=400)

        try:
            annee = int(anneeGlobale)
            localiteGlobale = int(localiteGlobale)
        except ValueError:
            return JsonResponse({"error": "Les paramètre 'annee', 'localite' doivent être des entiers."}, status=400)

        if tvaGlobale == 'avec':
            tva_filter = Case(
                When(taux_tva=20, then=F('montant_ht') + F('tva')),
                default=F('montant_ht'),
                output_field=IntegerField()
            )
        elif tvaGlobale =='sans':
            tva_filter = F('montant_ht')
        else:
            return JsonResponse({"error": "La valeur de 'tva' doit être 'avec' ou 'sans'."}, status=400)
        
        recettes = RecetteAllApmf.objects.annotate(
            annee = ExtractYear('date_facture'),
            mois = ExtractMonth('date_facture'),
            montant_avec_tva = tva_filter
        ).filter(
            annee = anneeGlobale,
            id_ville=localiteGlobale
        ).values('mois', 'id_ville') \
         .annotate(total_montant_ht= Sum('montant_avec_tva')) \
         .order_by('mois')

        # Créer une structure de données mensuelles avec 0 si aucun résultat
        mois_data = {
            'Janvier': 0, 'Février': 0, 'Mars': 0, 'Avril': 0, 'Mai': 0, 'Juin': 0,
            'Juillet': 0, 'Août': 0, 'Septembre': 0, 'Octobre': 0, 'Novembre': 0, 'Décembre': 0
        }

        for recette in recettes:
            mois_index = recette['mois'] - 1  # Mois dans la base de données commence à 1
            mois_names = list(mois_data.keys())  # Récupérer les noms des mois
            mois_data[mois_names[mois_index]] = recette['total_montant_ht']

                # Vérification de la présence des données pour la localité et mise à jour de la réponse
        result = {
            'mois': mois_data,
            'localiteGlobale' : localiteGlobale,
            'total': sum(mois_data.values())
        }

                # Si le total est 0, vérifier si la localité existe réellement dans la base
        if result['total'] == 0:
            localite_data = RecetteAllApmf.objects.filter(
                annee=anneeGlobale,
                id_ville=localiteGlobale
            ).exists()
            if not localite_data:
                return JsonResponse({"error": "Aucune donnée trouvée pour l' année spécifiée."}, status=404)

        return JsonResponse(result, safe=False)


class EvolutionMensuelleParCompte(APIView):
    def get(self, request):
        anneeParCompte = request.GET.get('anneeParCompte')
        localiteParCompte = request.GET.get('localiteParCompte')
        compteParCompte = request.GET.get('compteParCompte')
        tvaParCompte = request.GET.get('tvaParCompte')

        # Validation des paramètres
        if not all([anneeParCompte, localiteParCompte, compteParCompte, tvaParCompte]):
            return JsonResponse(
                {"error": "Tous les paramètres (anneeParCompte, localiteParCompte, compteParCompte, tvaParCompte) sont requis."},
                status=400
            )

        try:
            anneeParCompte = int(anneeParCompte)
            localiteParCompte = int(localiteParCompte)
            compteParCompte = int(compteParCompte)
        except ValueError:
            return JsonResponse(
                {"error": "Les paramètres 'anneeParCompte', 'localiteParCompte' et 'compteParCompte' doivent être des entiers."},
                status=400
            )

        # Configuration du filtre TVA
        if tvaParCompte == 'avec':
            tva_filter = F('montant_ht') + F('tva')
        elif tvaParCompte == 'sans':
            tva_filter = F('montant_ht')
        else:
            return JsonResponse({"error": "La valeur de 'tva' doit être 'avec' ou 'sans'."}, status=400)

        # Requête principale
        recettes = RecetteAllApmf.objects.annotate(
            annee=ExtractYear('date_facture'),
            mois=ExtractMonth('date_facture'),
            montant_avec_tva=tva_filter
        ).filter(
            annee=anneeParCompte,
            id_ville=localiteParCompte,
            id_compte=compteParCompte
        ).values('mois').annotate(
            total_montant_ht=Sum('montant_avec_tva')
        ).order_by('mois')

        # Préparer les données mensuelles
        mois_data = {
            'Janvier': 0, 'Février': 0, 'Mars': 0, 'Avril': 0, 'Mai': 0, 'Juin': 0,
            'Juillet': 0, 'Août': 0, 'Septembre': 0, 'Octobre': 0, 'Novembre': 0, 'Décembre': 0
        }

        for recette in recettes:
            mois_index = recette['mois'] - 1
            mois_names = list(mois_data.keys())
            mois_data[mois_names[mois_index]] = recette['total_montant_ht']

        # Retourner les résultats
        result = {
            'localiteParCompte': localiteParCompte,
            'mois': mois_data,
            'total': sum(mois_data.values()),
        }

        if result['total'] == 0:
            return JsonResponse({"error": "Aucune donnée trouvée pour ces critères."}, status=404)

        return JsonResponse(result, safe=False)

class EvolutionParVilleSur5Ans(APIView):
    def get(self, request):
        # Récupérer l'année de début
        annee_debut = int(request.query_params.get('anneeDebut'))
        if not annee_debut:
            return Response({"error": "Année de début est requise"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            annee_debut = int(annee_debut)
        except ValueError:
            return Response({"error": "Année de début doit être un entier"}, status=status.HTTP_400_BAD_REQUEST)

        # Calculer les années sur 5 ans
        annees = [annee_debut + i for i in range(5)]

        # Récupérer les données groupées par ville et année
        recettes = (
            RecetteAllApmf.objects.filter(date_facture__year__in=annees)
            .values('id_ville', 'date_facture__year')
            .annotate(total_recette=Sum('montant_ttc'))
            .order_by('id_ville', 'date_facture__year')
        )

        # Organiser les données par ville
        villes = Ville.objects.all()
        resultat = []
        for ville in villes:
            ligne = {"code_loc": ville.code_ville, "localite": ville.nom_ville}
            for annee in annees:
                # Trouver les recettes pour la ville et l'année
                recette = next((rec['total_recette'] for rec in recettes if rec['id_ville'] == ville.id_ville and rec['date_facture__year'] == annee), 0)
                ligne[str(annee)] = recette
            resultat.append(ligne)

        # Retourner les données
        return Response(resultat, status=status.HTTP_200_OK)


class EvolutionParCompteSur5Ans(APIView):
    def get(self, request):
        # Récupérer les paramètres
        localite = request.query_params.get('localiteParCompte5')
        annee_debut = request.query_params.get('yearStart')

        # Vérification des paramètres
        if not all([localite, annee_debut]):
            return Response(
                {"error": "Localité et Année de début sont requis"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            localite = int(localite)
            annee_debut = int(annee_debut)
        except ValueError:
            return Response(
                {"error": "Localité et Année de début doivent être des entiers"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calculer les années sur 5 ans
        annees = [annee_debut + i for i in range(5)]

        # Filtrer les données par localité et années
        recettes = (
            RecetteAllApmf.objects.filter(id_ville=localite, date_facture__year__in=annees)
            .values('id_compte', 'id_compte__code', 'id_compte__libelle', 'date_facture__year')
            .annotate(total_recette=Sum('montant_ttc'))
            .order_by('id_compte', 'date_facture__year')
        )

        # Organiser les données par compte
        comptes = recettes.values('id_compte').distinct()
        resultat = []
        for compte in comptes:
            compte_id = compte['id_compte']
            code_compte = next(
                (rec['id_compte__code'] for rec in recettes if rec['id_compte'] == compte_id),
                None,
            )
            libelle_compte = next(
                (rec['id_compte__libelle'] for rec in recettes if rec['id_compte'] == compte_id),
                None,
            )

            ligne = {
                "id_compte": compte_id,
                "code": code_compte,
                "libelle": libelle_compte,
            }

            # Ajouter les recettes pour chaque année
            for annee in annees:
                recette = next(
                    (rec['total_recette'] for rec in recettes if rec['id_compte'] == compte_id and rec['date_facture__year'] == annee),
                    0,
                )
                ligne[str(annee)] = recette

            # Ajouter la ligne au résultat
            resultat.append(ligne)

        # Retourner les données
        return Response(resultat, status=status.HTTP_200_OK)



class RecetteAllApmfDetailView(APIView):
    def get(self, request, pk):
        try:
            recette = RecetteAllApmf.objects.get(pk=pk)
        except RecetteAllApmf.DoesNotExist:
            return Response({'error': 'Recette all Apmf non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RecetteAllApmfSerializer(recette)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            recette = RecetteAllApmf.objects.get(pk=pk)
        except RecetteAllApmf.DoesNotExist:
            return Response({'error': 'Recette all Apmf non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RecetteAllApmfSerializer(recette, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            recette = RecetteAllApmf.objects.get(pk=pk)
        except RecetteAllApmf.DoesNotExist:
            return Response({'error': 'Recette all Apmf non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        recette.delete()
        return Response({'message': 'Recette all Apmf supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
