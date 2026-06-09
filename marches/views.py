from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Marches
from .serializers import MarcheSerializer
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import json
import logging
import psycopg2
from .models import HistoriqueMarches
from datetime import datetime
from .models import AttachementParCompte, Marches
from .serializers import AttachementParCompteSerializer
from .models import Marches
from django.db.models import Sum, F
from elaborationBudget.models import  ModificationSuppressionBudget
from django.db import connection
from budget.models import Budget
from marches.models import Marches
from pta.models import PTA
from comptes.models import Comptes
from direction.models import Direction
from django.db.models import F, OuterRef, Subquery


class MarcheListView(APIView):
    def get(self, request):
        marches = Marches.objects.all()
        serializer = MarcheSerializer(marches, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("Données reçues:", request.data)
        
        # Vérification des types
        if not isinstance(request.data.get('id_compte'), int):
            return Response({'error': 'id_compte doit être un entier'}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(request.data.get('id_financement'), int):
            return Response({'error': 'id_financement doit être un entier'}, status=status.HTTP_400_BAD_REQUEST)


        if not isinstance(request.data.get('id_type_depense'), int):
            return Response({'error': 'id_type_depense doit être un entier'}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(request.data.get('delai_en_jour'), int):
            return Response({'error': 'delai_en_jour doit être un entier'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = MarcheSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MarcheDetailView(APIView):
    def get(self, request, annee, num_marche):
        try:
            # Récupérer les marchés filtrés selon les paramètres d'URL
            queryset = Marches.objects.all()

            if annee:
                queryset = queryset.filter(annee=annee)
            if num_marche:
                queryset = queryset.filter(num_marche=num_marche)

            # Vérifier si des résultats existent
            if not queryset.exists():
                return Response({"error": "Aucun marché trouvé avec les critères donnés."},
                                status=status.HTTP_404_NOT_FOUND)

            # Sérialisation des résultats
            serializer = MarcheSerializer(queryset, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Erreur lors de la récupération des marchés: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

   #mis a jour et historisation marches
    def put(self, request, id):
        try:
            # Récupérer la dépense existante par son ID
            marche = get_object_or_404(Marches, pk=id)
            print("Dépense trouvée:", marche)

            # Récupérer les données du corps de la requête PUT
            new_data = request.data  # DRF gère automatiquement le parsing JSON
            print("Données reçues pour mise à jour:", new_data)

            # Sauvegarder l'historique avant la mise à jour
            HistoriqueMarches.objects.create(
                id_marche=marche.id_marche,
                annee=marche.annee,
                id_compte=marche.id_compte,
                num_marche=marche.num_marche,
                id_financement=marche.id_financement,
                id_type_depense=marche.id_type_depense,
                objet_marche=marche.objet_marche,
                attributaire=marche.attributaire,
                montant_ht=marche.montant_ht,
                tva=marche.tva,
                num_os=marche.num_os,
                date_os=marche.date_os,
                num_sur_registre=marche.num_sur_registre,
                delai_en_jour=marche.delai_en_jour,
                date_notification=marche.date_notification,
                observation=marche.observation,
                date_misajour=datetime.now(),
            )
            print("Historique marché sauvegardé.")

            # Mise à jour de la dépense
            serializer = MarcheSerializer(marche, data=new_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("Erreur interne:", str(e))
            return JsonResponse({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    def delete(self, request, pk):
        try:
            marche = Marches.objects.get(pk=pk)
        except Marches.DoesNotExist:
            return Response(
                {'error': 'Marches non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        marche.delete()  # Supprimer le budget
        return Response(
            {'message': 'Marche supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )


class AttachementParCompteView(APIView):
    def post(self, request):
        try:
            # Extraire les données de la requête
            annee = request.data.get('annee')  # Année du contrat
            num_marche = request.data.get('num_marche')  # Numéro de marché
            annee_paiement = request.data.get('annee_paiement')
            num_attachement = request.data.get('num_attachement')
            montant = request.data.get('montant')

            # Recherche de l'ID du marché selon l'année et le num_marche
            marche = get_object_or_404(Marches, annee=annee, num_marche=num_marche)

            # Création de l'attachement
            attachement_data = {
                "id_marche": marche.id_marche,
                "annee_paiement": annee_paiement,
                "num_attachement": num_attachement,
                "montant": montant,
            }

            serializer = AttachementParCompteSerializer(data=attachement_data)

            if serializer.is_valid():
                serializer.save()
                return Response({"success": True, "data": serializer.data}, status=status.HTTP_201_CREATED)
            return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Log the error details
            print("Erreur lors de l'exécution du POST: ", str(e))  # Affiche l'erreur dans la console
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class VisualisationDesMarches(APIView):
    def get(self, request, *args, **kwargs):
        # Récupérer l'année depuis les paramètres de l'URL
        annee = kwargs.get('annee')
        if not annee:
            return Response({"error": "L'année est requise."}, status=400)

        # Convertir l'année en entier
        try:
            annee = int(annee)
        except ValueError:
            return Response({"error": "L'année doit être un entier valide."}, status=400)

        # Filtrer les marchés par l'année donnée
        marches = Marches.objects.filter(annee=annee)

        # Liste des données à retourner
        data = []

        for marche in marches:
            # Calcul du décaissement à partir des attachements dans la table 'modification_suppression_budget'
            total_decaissement = ModificationSuppressionBudget.objects.filter(
                num_marche=marche.num_marche
            ).aggregate(
                total_decaissement=Sum('attach1') + Sum('attach2') + Sum('attach3') + 
                                   Sum('attach4') + Sum('attach5') + Sum('attach6') + 
                                   Sum('attach7') + Sum('attach8') + Sum('attach9') + 
                                   Sum('attach10') + Sum('attach11') + Sum('attach12') +
                                   Sum('attach13') + Sum('attach14') + Sum('attach15') + 
                                   Sum('attach16') + Sum('attach17') + Sum('attach18') +
                                   Sum('attach19') + Sum('attach20')
            )

            total_decaissement = total_decaissement['total_decaissement'] or 0  # Assurez-vous que la somme est correcte

            # Ajouter les informations du marché à la liste
            data.append({
                "num_marche": marche.num_marche,
                "libelle": marche.objet_marche,
                "attributaire": marche.attributaire,
                "montant": marche.montant_ht,
                "decaissement": total_decaissement,
                "observation": marche.observation,
            })

        # Retourner les données sous forme de réponse JSON
        return Response(data)


class AttachementParProjet(APIView):
    def get(self, request, id_compte, annee):
        # Vérifier si 'id_compte' et 'annee' sont passés comme paramètres dans la requête
        if not id_compte or not annee:
            return Response({"error": "id_compte et annee sont requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Requête pour récupérer les marchés associés à l'id_compte et à l'annee
            marches = Marches.objects.filter(id_compte=id_compte, annee=annee)

            # Si aucun marché n'est trouvé
            if not marches.exists():
                return Response({"message": "Aucun marché trouvé pour ce compte et cette année."}, status=status.HTTP_404_NOT_FOUND)

            projets = []
            for marche in marches:
                # Requête pour récupérer les modifications associées au marché
                modifications = ModificationSuppressionBudget.objects.filter(
                    num_marche=marche.num_marche  # Utilisation de num_marche pour la correspondance avec ModificationSuppressionBudget
                )

                # Si aucune modification n'est trouvée pour ce marché, on passe au suivant
                if not modifications.exists():
                    continue

                # Accumuler les données pour chaque modification trouvée
                for mod in modifications:
                    projets.append({
                        "prgm": marche.objet_marche,
                        "libelle": marche.objet_marche,  # Assurez-vous que ce champ existe dans le modèle 'Marches'
                        "montant": marche.montant_ht,
                        "numMarche": marche.num_marche,
                        "avance": mod.avance,
                        "rembGarantie": mod.remb_garantie,
                        "att1": mod.attach1,
                        "att2": mod.attach2,
                        "att3": mod.attach3,
                        "att4": mod.attach4,
                        "att5": mod.attach5,
                        "att6": mod.attach6,
                        "att7": mod.attach7,
                        "att8": mod.attach8,
                        "att9": mod.attach9,
                        "att10": mod.attach10,
                        "att11": mod.attach11,
                        "att12": mod.attach12,
                        "att13": mod.attach13,
                        "att14": mod.attach14,
                        "att15": mod.attach15,
                        "att16": mod.attach16,
                        "att17": mod.attach17,
                        "att18": mod.attach18,
                        "att19": mod.attach19,
                        "att20": mod.attach20,

                    })

            # Si aucun projet n'a été trouvé après itération
            if not projets:
                return Response({"message": "Aucun projet trouvé pour les critères spécifiés."}, status=status.HTTP_404_NOT_FOUND)

            # Retourner les projets trouvés
            return Response(projets, status=status.HTTP_200_OK)

        except Exception as e:
            # Retourner une erreur interne si une exception est levée
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SuiviDecaissements(APIView):
    def get(self, request, *args, **kwargs):
        annee = kwargs.get('annee')  # Récupère l'année passée dans l'URL
        if not annee:
            return Response({"error": "Paramètre 'annee' manquant"}, status=400)

        query = """
            SELECT 
                c.id_compte AS compte,
                c.code AS code_compte,
                b.libelle,
                b.montant AS budget,
                m.num_marche,
                m.attributaire AS titulaire,
                m.montant_ht AS montant_marche,
                COALESCE(SUM(msb.attach1 + msb.attach2 + msb.attach3 + msb.attach4), 0) AS paiement_anterieur,
                COALESCE(SUM(msb.attach5 + msb.attach6 + msb.attach7 + msb.attach8), 0) AS paiement_annee,
                m.montant_ht - COALESCE(SUM(msb.attach1 + msb.attach2 + msb.attach3 + msb.attach4 + msb.attach5 + msb.attach6 + msb.attach7 + msb.attach8), 0) AS reste_a_payer
            FROM 
                marches m
            LEFT JOIN 
                modification_suppression_budget msb ON m.num_marche = msb.num_marche
            LEFT JOIN 
                budget b ON m.id_compte = b.id_compte AND m.annee = b.annee
            LEFT JOIN 
                comptes c ON m.id_compte = c.id_compte
            WHERE 
                m.annee = %s
            GROUP BY 
                c.id_compte, c.code, b.libelle, b.montant, m.num_marche, m.attributaire, m.montant_ht
            ORDER BY 
                compte;
        """

        with connection.cursor() as cursor:
            cursor.execute(query, [annee])
            results = cursor.fetchall()

        # Structurer les données en format JSON
        data = [
            {
                "compte": row[0],
                "code_compte": row[1],
                "libelle": row[2],
                "budget": float(row[3]) if row[3] else None,
                "num_marche": row[4],
                "titulaire": row[5],
                "montant_marche": float(row[6]) if row[6] else None,
                "paiement_anterieur": float(row[7]) if row[7] else 0.0,
                "paiement_annee": float(row[8]) if row[8] else 0.0,
                "reste_a_payer": float(row[9]) if row[9] else 0.0,
            }
            for row in results
        ]

        return Response(data, status=200)



class HistoriqueDePaiement(APIView):
    def get(self, request, *args, **kwargs):
        # Récupérer l'année de départ (annee) depuis les paramètres de l'URL
        annee_debut = kwargs.get('annee')
        if not annee_debut:
            return Response({"error": "L'année de départ est requise."}, status=400)

        try:
            annee_debut = int(annee_debut)
        except ValueError:
            return Response({"error": "L'année de départ doit être un entier valide."}, status=400)

        # Requête SQL pour récupérer les paiements par année et ville
        query = """
            SELECT v.nom_ville, m.num_marche, m.objet_marche, m.attributaire, m.montant_ht,
                msb.annee_modification,
                COALESCE(SUM(CASE WHEN msb.annee_modification = %s THEN msb.attach1 ELSE 0 END), 0) AS paiement_2024,
                COALESCE(SUM(CASE WHEN msb.annee_modification = %s THEN msb.attach2 ELSE 0 END), 0) AS paiement_2025,
                COALESCE(SUM(CASE WHEN msb.annee_modification = %s THEN msb.attach3 ELSE 0 END), 0) AS paiement_2026,
                COALESCE(SUM(CASE WHEN msb.annee_modification = %s THEN msb.attach4 ELSE 0 END), 0) AS paiement_2027,
                COALESCE(SUM(CASE WHEN msb.annee_modification = %s THEN msb.attach5 ELSE 0 END), 0) AS paiement_2028
            FROM ville v
            JOIN budget b ON b.id_ville = v.id_ville
            JOIN marches m ON m.id_compte = b.id_compte
            LEFT JOIN modification_suppression_budget msb ON msb.num_marche = m.num_marche
            WHERE msb.annee_modification >= %s AND msb.annee_modification < %s
            GROUP BY v.nom_ville, m.num_marche, m.objet_marche, m.attributaire, m.montant_ht, msb.annee_modification
            ORDER BY v.nom_ville, m.num_marche
        """


        with connection.cursor() as cursor:
            cursor.execute(query, [annee_debut, annee_debut + 1, annee_debut + 2, annee_debut + 3, annee_debut + 4, annee_debut, annee_debut + 5])
            rows = cursor.fetchall()

        if not rows:
            return Response({"error": "Aucun marché trouvé pour l'année spécifiée."}, status=404)

        # Organiser les résultats par ville
        result = {}
        for row in rows:
            ville = row[0]  # Nom de la ville
            num_marche = row[1]
            montant_ht = row[4]
            paiements = [
                row[5] if row[5] is not None else 0,
                row[6] if row[6] is not None else 0,
                row[7] if row[7] is not None else 0,
                row[8] if row[8] is not None else 0,
                row[9] if row[9] is not None else 0,
            ]
            total_paiements = sum(paiements)
            reste_a_payer = montant_ht - total_paiements

            # Si la ville n'est pas encore dans le dictionnaire, on l'ajoute
            if ville not in result:
                result[ville] = []

            result[ville].append({
                "num_marche": num_marche,
                "libelle": row[2],
                "attributaire": row[3],
                "montant_ht": montant_ht,
                "total_paiements": paiements,
                "reste_a_payer": reste_a_payer,
            })

        return Response(result, status=200)



class AnalyseDesEcarts(APIView):
    def get(self, request, *args, **kwargs):  # You can access 'year' via kwargs
        try:
            year = kwargs.get('annee')  # Retrieve 'annee' from kwargs
            marches = (
                Marches.objects.filter(annee=year)
                .select_related("id_compte")  # For accessing the related 'comptes'
                .annotate(
                    compte_code=F("id_compte__code"),  # Adding the 'code' field
                    budget=F("id_compte__budget__montant"),  # Example if related to budget
                )
            )
            data = [
                {
                    "compte": marche.compte_code,
                    "projet": marche.objet_marche,
                    "num_marche": marche.num_marche,
                    "budget_pta": marche.budget,
                    "realisation_marche": marche.montant_ht,
                    "ecart": marche.budget - marche.montant_ht if marche.budget else None,
                }
                for marche in marches
            ]
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


class ExecutionPTA(APIView):
    def get(self, request):
        try:
            # Récupérer l'année choisie à partir des paramètres de la requête
            annee = request.GET.get('annee')
            
            if not annee:
                return JsonResponse({"error": "L'année est requise"}, status=400)

            # Récupérer les données pour l'exécution du PTA en fonction de l'année
            pta_data = (
                PTA.objects.filter(annee=annee)  # Filtrer par année
                .select_related('id_direction')  # Joindre 'id_direction' via la clé étrangère
                .annotate(
                    # Joindre 'Budget' en utilisant la relation 'code_programme'
                    compte_code=Subquery(
                        Budget.objects.filter(
                            code_programme=OuterRef('code_programme')
                        ).values('id_compte__code')[:1]
                    ),
                    libelle_budget=Subquery(
                        Budget.objects.filter(
                            code_programme=OuterRef('code_programme')
                        ).values('libelle')[:1]
                    ),
                    montant_budget=Subquery(
                        Budget.objects.filter(
                            code_programme=OuterRef('code_programme')
                        ).values('montant')[:1]
                    )
                )
            )

            # Calcul des écarts et taux de réalisation
            data = [
                {
                    "code_strategique": pta.code_strategique,
                    "code_activite": pta.code_activite,
                    "libelle": pta.libelle,
                    "compte": pta.compte_code,
                    "montant_previsionnel": pta.montant_budget,  # Montant prévisionnel de la table 'budget'
                    "montant_realisation": pta.montant,  # Montant de réalisation de la table 'pta'
                    "ecart": pta.montant_budget - pta.montant if pta.montant_budget else None,  # Calcul de l'écart
                    "taux_realisation": (pta.montant / pta.montant_budget * 100) if pta.montant_budget else None,  # Calcul du taux de réalisation
                }
                for pta in pta_data
            ]
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)





class ExecutionPTAParDirection(APIView):
    def get(self, request):
        try:
            # Récupérer l'année et l'ID de la direction depuis les paramètres de la requête
            annee = request.GET.get('annee')
            direction_id = request.GET.get('id_direction')

            # Vérification de la présence des paramètres requis
            if not annee or not direction_id:
                return JsonResponse({"error": "L'année et l'ID de la direction sont requis"}, status=400)

            # Assurez-vous que l'id_direction est bien un entier
            try:
                direction_id = int(direction_id)
            except ValueError:
                return JsonResponse({"error": "L'ID de la direction doit être un entier"}, status=400)

            # Vérifier si l'ID de la direction existe dans la table Direction
            direction = Direction.objects.filter(id_direction=direction_id).first()
            if not direction:
                return JsonResponse({"error": "ID de direction invalide"}, status=400)

            # Filtrage des données PTA en fonction de l'année et de l'ID de la direction
            pta_data = PTA.objects.filter(annee=annee, id_direction=direction_id)

            # Vérification qu'il y a des résultats dans PTA pour cette direction et année
            if pta_data.count() == 0:
                return JsonResponse({"error": "Aucune donnée trouvée pour cette année et cette direction"}, status=404)

            # Annoter les données avec les informations du Budget
            pta_data = pta_data.annotate(
                compte_code=Subquery(
                    Budget.objects.filter(
                        code_programme=OuterRef('code_programme')
                    ).values('id_compte__code')[:1]
                ),
                libelle_budget=Subquery(
                    Budget.objects.filter(
                        code_programme=OuterRef('code_programme')
                    ).values('libelle')[:1]
                ),
                montant_budget=Subquery(
                    Budget.objects.filter(
                        code_programme=OuterRef('code_programme')
                    ).values('montant')[:1]
                )
            )

            # Calcul des écarts et taux de réalisation
            data = [
                {
                    "code_strategique": pta.code_strategique,
                    "code_activite": pta.code_activite,
                    "libelle": pta.libelle,
                    "compte": pta.compte_code,
                    "montant_previsionnel": pta.montant_budget,
                    "montant_realisation": pta.montant,
                    "ecart": pta.montant_budget - pta.montant if pta.montant_budget else None,
                    "taux_realisation": (pta.montant / pta.montant_budget * 100) if pta.montant_budget else None,
                }
                for pta in pta_data
            ]

            # Retourner les données filtrées
            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
