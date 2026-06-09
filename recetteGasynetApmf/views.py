from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.db.models import Sum, F, FloatField, ExpressionWrapper, DecimalField
from .models import RecetteGasyNet, RecetteAllApmf, Comptes
from  budget.models import Budget
from datetime import datetime
from decimal import Decimal
from rest_framework import status


class EtatGlobaleView(APIView):
    def get(self, request):
        """
        Combine les données de recette_gasynet et recette_all_apmf pour les états globaux.
        """
        # Récupérer les paramètres GET
        annee_debut = request.GET.get('anneeDebut')
        tva_option = request.GET.get('tva')  # "avec" ou "sans"

        # Vérification des paramètres requis
        if not annee_debut or not tva_option:
            return Response({'error': 'Année de début et TVA sont requis'}, status=400)

        # Convertir en entier
        try:
            annee_debut = int(annee_debut)
        except ValueError:
            return Response({'error': 'Année de début doit être un entier'}, status=400)

        # Calculer les années sur 5 ans
        annees = [annee_debut + i for i in range(5)]

        # Filtrer les recettes Gasynet et APMF
        gasynet_recettes = RecetteGasyNet.objects.filter(date_recette__year__gte=annee_debut)
        apmf_recettes = RecetteAllApmf.objects.filter(date_facture__year__gte=annee_debut)

        # Appliquer le filtre TVA

        if tva_option == 'avec':
            # Pour l'option 'avec', créer une nouvelle colonne temporaire pour le montant TTC
            gasynet_recettes = gasynet_recettes.annotate(
                mnt_ttc=ExpressionWrapper(F('montant_ht') * 1.2, output_field=FloatField())
            )
            apmf_recettes = apmf_recettes.annotate(
                mnt_ttc=ExpressionWrapper(F('montant_ht') * 1.2, output_field=FloatField())
            )
        else:
            gasynet_recettes = gasynet_recettes.annotate(mnt_ttc=F('montant_ht'))
            apmf_recettes = apmf_recettes.annotate(mnt_ttc=F('montant_ht'))

        # Calculs par année pour Gasynet
        if tva_option == 'avec':
            gasynet_data = gasynet_recettes.values('id_compte', 'date_recette__year').annotate(
                montant_ht_total_gasy=ExpressionWrapper(F('montant_ht') * 1.2, output_field=FloatField())
            )
        else:
            gasynet_data = gasynet_recettes.values('id_compte', 'date_recette__year').annotate(
                montant_ht_total_gasy=Sum('montant_ht')
            )

        # Calculs par année pour APMF
        if tva_option == 'avec':
            apmf_data = apmf_recettes.values('id_compte', 'date_facture__year').annotate(
                montant_ht_total_apmf=Sum('montant_ttc')
            )
        else:
            apmf_data = apmf_recettes.values('id_compte', 'date_facture__year').annotate(
                montant_ht_total_apmf=Sum('montant_ht')
            )

        # Préparer la réponse
        results = []
        comptes = Comptes.objects.filter(id_type_compte=1)
        for compte in comptes:
            ligne = {
                'compte': compte.code,
                'libelle': compte.libelle,
                'total_ht': 0
            }

            # Ajouter les recettes par année
            for annee in annees:
                gasynet_ht = next(
                    (item['montant_ht_total_gasy'] for item in gasynet_data
                     if item['id_compte'] == compte.id_compte and item['date_recette__year'] == annee), 0
                )
                apmf_ht = next(
                    (item['montant_ht_total_apmf'] for item in apmf_data
                     if item['id_compte'] == compte.id_compte and item['date_facture__year'] == annee), 0
                )
                ligne[str(annee)] = gasynet_ht + apmf_ht
                ligne['total_ht'] += gasynet_ht + apmf_ht

            results.append(ligne)

        return Response(results)

class AnalyseEcartView(APIView):
    def get(self, request, *args, **kwargs):
        # Récupération des paramètres
        annee_debut = int(request.query_params.get('anneeDebutAnalyse', datetime.now().year))
        tva = request.query_params.get('tvaAnalyse')  # Récupérer l'option TVA
        comptes = request.query_params.getlist('comptes', [])  # Récupérer les comptes sélectionnés
        
        # Si aucun compte n'est passé, inclure tous les comptes
        if not comptes:
            comptes = Comptes.objects.filter(id_type_compte=1).values_list('id_compte', flat=True)
           # comptes = Comptes.objects.filter(id_type_compte=1)

        
        # Calculer les années à traiter
        annees = [annee_debut + i for i in range(5)]

        # Récupérer les prévisions et réalisations
        previsions = Budget.objects.filter(annee__in=annees, id_compte__in=comptes)
        recette_all_apmf_realisation = RecetteAllApmf.objects.filter(date_facture__year__in=annees)
        recette_gasynet_realisation = RecetteGasyNet.objects.filter(date_recette__year__in=annees)

        resultats = []

        for compte_id in comptes:
            compte = Comptes.objects.get(pk=compte_id)  # Récupérer l'objet compte
            previsions_compte = previsions.filter(id_compte=compte_id)
            recettes_all_apmf_compte = recette_all_apmf_realisation.filter(id_compte=compte_id)
            recettes_gasynet_compte = recette_gasynet_realisation.filter(id_compte=compte_id)

            compte_resultat = {
                'compte': {
                    'id': compte.id_compte,
                    'code': compte.code,
                    'libelle': compte.libelle,
                },
                'annees': []
            }

            for annee in annees:
                # Prévision
                prevision = previsions_compte.filter(annee=annee).aggregate(Sum('montant'))['montant__sum'] or 0
                if tva == 'avec':
                    # Réalisation
                    realisation_all_apmf = recettes_all_apmf_compte.filter(date_facture__year=annee).aggregate(Sum('montant_ttc'))['montant_ttc__sum'] or 0

                    realisation_gasynet = recettes_gasynet_compte.filter(date_recette__year=annee).aggregate(
                        montant_ttc_sum=ExpressionWrapper(Sum('montant_ht') * Decimal('1.2'), output_field=DecimalField())
                    )['montant_ttc_sum'] or 0

                    # Convertir le résultat en Decimal et quantiser à 2 décimales
                    realisation_gasynet_decimal = Decimal(realisation_gasynet).quantize(Decimal('0.01'))


                    realisation = realisation_all_apmf + realisation_gasynet
                else:
                    # Réalisation
                    realisation_all_apmf = recettes_all_apmf_compte.filter(date_facture__year=annee).aggregate(Sum('montant_ht'))['montant_ht__sum'] or 0
                    realisation_gasynet = recettes_gasynet_compte.filter(date_recette__year=annee).aggregate(Sum('montant_ht'))['montant_ht__sum'] or 0

                    realisation = realisation_all_apmf + realisation_gasynet


                # Écart et taux
                ecart = realisation - prevision
                taux_realisation = (realisation / prevision * 100) if prevision > 0 else 0

                compte_resultat['annees'].append({
                    'annee': annee,
                    'prevision': prevision,
                    'realisation': realisation,
                    'ecart': ecart,
                    'taux_realisation': taux_realisation,
                })

            resultats.append(compte_resultat)

        return Response(resultats)


class EcartAnnuelView(APIView):
    def get(self, request, *args, **kwargs):
        # Récupération des paramètres
        annee = int(request.query_params.get('anneeEcart', datetime.now().year))
        tva = request.query_params.get('tvaEcart')  # Récupérer l'option TVA
        
        # Récupérer les prévisions et réalisations pour l'année spécifiée
        previsions = Budget.objects.filter(annee=annee)
        recette_all_apmf_realisation = RecetteAllApmf.objects.filter(date_facture__year=annee)
        recette_gasynet_realisation = RecetteGasyNet.objects.filter(date_recette__year=annee)

        resultats = []

        # Récupérer tous les comptes
        comptes = Comptes.objects.filter(id_type_compte=1)

        for compte in comptes:
            compte_id = compte.id_compte  # Utiliser l'ID du compte pour le filtre

            previsions_compte = previsions.filter(id_compte=compte_id)
            recettes_all_apmf_compte = recette_all_apmf_realisation.filter(id_compte=compte_id)
            recettes_gasynet_compte = recette_gasynet_realisation.filter(id_compte=compte_id)

            compte_resultat = {
                'compte': {
                    'id': compte.id_compte,
                    'code': compte.code,
                    'libelle': compte.libelle,
                },
                'annees': []
            }

            # Prévision
            prevision = previsions_compte.aggregate(Sum('montant'))['montant__sum'] or 0
            
            if tva == 'avec':
                # Réalisation
                realisation_all_apmf = recettes_all_apmf_compte.aggregate(Sum('montant_ttc'))['montant_ttc__sum'] or 0

                realisation_gasynet = recettes_gasynet_compte.aggregate(
                    montant_ttc_sum=ExpressionWrapper(Sum('montant_ht') * Decimal('1.2'), output_field=DecimalField())
                )['montant_ttc_sum'] or 0

                # Convertir le résultat en Decimal et quantiser à 2 décimales
                realisation_gasynet_decimal = Decimal(realisation_gasynet).quantize(Decimal('0.01'))

                realisation = realisation_all_apmf + realisation_gasynet_decimal
            else:
                # Réalisation
                realisation_all_apmf = recettes_all_apmf_compte.aggregate(Sum('montant_ht'))['montant_ht__sum'] or 0
                realisation_gasynet = recettes_gasynet_compte.aggregate(Sum('montant_ht'))['montant_ht__sum'] or 0

                realisation = realisation_all_apmf + realisation_gasynet

            # Écart et taux
            ecart = realisation - prevision
            taux_realisation = (realisation / prevision * 100) if prevision > 0 else 0

            compte_resultat['annees'].append({
                'annee': annee,
                'prevision': prevision,
                'realisation': realisation,
                'ecart': ecart,
                'taux_realisation': taux_realisation,
            })

            # Ajouter le résultat du compte au tableau global
            resultats.append(compte_resultat)  # Cette ligne est maintenant DANS la boucle

        return Response(resultats)



    def post(self, request, *args, **kwargs):
        # Logic for POST request
        return Response({"message": "POST request successful"}, status=status.HTTP_201_CREATED)








        

