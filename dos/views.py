from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Dos
from .serializers import DosSerializer
from pta.models import PTA
from comptes.models import Comptes
from realisationBudget.models import DepensesSIIG
from django.db.models import Sum


class DosListView(APIView):
    def get(self, request, *args, **kwargs):
        id_dos = Dos.objects.all()  # Récupérer tous les types de tiers
        serializer = DosSerializer(id_dos, many=True)  # Sérialiser les objets
        return Response(serializer.data)  # Retourner la réponse au format JSON

    def post(self, request):
        serializer = DosSerializer(data=request.data)  # Créer un sérialiseur avec les données de la requête
        if serializer.is_valid():  # Vérifier si les données sont valides
            serializer.save()  # Sauvegarder le nouvel objet
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Retourner la réponse avec un code 201 (création réussie)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Retourner une erreur si le sérialiseur n'est pas valide


class DosDetailsiew(APIView):
    
    def delete(self, request, pk):
        try:
            dos = Dos.objects.get(pk=pk)
        except Dos.DoesNotExist:
            return Response(
                {'error': 'Dos non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        dos.delete()  # Supprimer le pta
        return Response(
            {'message': 'Dos supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )

    def put(self, request, pk):
        try:
            dos = Dos.objects.get(pk=pk)
        except Dos.DoesNotExist:
            return Response(
                {'error': 'Dos non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = DosSerializer(dos, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()  # Mettre à jour les données dans la base de données
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExecutionDos(APIView):
    def get(self, request):
        # Récupérer l'année depuis les paramètres GET
        annee = request.GET.get('annee', None)
        if not annee:
            return Response({"error": "Année non fournie"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Récupérer les enregistrements PTA correspondant à l'année
            pta_data = PTA.objects.filter(annee=annee)
            if not pta_data.exists():
                return Response({"message": "Aucune donnée PTA trouvée pour l'année donnée"}, status=status.HTTP_404_NOT_FOUND)

            # Obtenir les valeurs nécessaires (par exemple, `code_programme`)
            code_programme_list = pta_data.values_list('code_programme', flat=True)

            # Récupérer les dépenses correspondantes
            depenses_data = DepensesSIIG.objects.filter(code_programme__in=code_programme_list, annee=annee)
            if not depenses_data.exists():
                return Response({"message": "Aucune dépense trouvée pour les programmes donnés"}, status=status.HTTP_404_NOT_FOUND)

            # Récupérer les comptes associés aux dépenses
            comptes_ids = depenses_data.values_list('id_compte', flat=True)
            comptes_data = Comptes.objects.filter(id_compte__in=comptes_ids)

            # Construire la réponse
            result = []
            for pta in pta_data:
                depenses = depenses_data.filter(code_programme=pta.code_programme).values(
                    'num_engagement', 'id_compte', 'montant'
                )
                for depense in depenses:
                    compte = comptes_data.filter(id_compte=depense['id_compte']).first()
                    result.append({
                        "ref_dos": pta.ref_dos,
                        "code_programme": pta.code_programme,
                        "code_strategique": pta.code_strategique,
                        "code_activite": pta.code_activite,
                        "libelle_pta": pta.libelle,
                        "montant_pta": pta.montant,
                        "num_engagement": depense['num_engagement'],
                        "id_compte": depense['id_compte'],
                        "code_compte": compte.code if compte else None,
                        "montant_depense": depense['montant'],
                    })

            if not result:
                return Response({"message": "Aucune correspondance trouvée entre PTA et dépenses"}, status=status.HTTP_404_NOT_FOUND)

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class SituationDos(APIView):
    def get(self, request):
        # Récupération de l'année de début à partir des paramètres de requête
        annee_debut = request.query_params.get('annee_debut', None)
        
        if not annee_debut or not annee_debut.isdigit():
            return Response({"error": "Veuillez fournir une année valide."}, status=status.HTTP_400_BAD_REQUEST)

        annee_debut = int(annee_debut)
        annees = [annee_debut + i for i in range(5)]  # Liste des 5 années

        # Récupération des données dynamiques à partir des tables `pta` et `dos`
        situation_data = []

        # Pour chaque enregistrement de `Dos`, récupérer les activités correspondantes
        dos_records = Dos.objects.all()  # Tous les DOS
        for dos in dos_records:
            # Calcul des montants cumulés pour chaque année
            montants_par_annee = []
            code_activite = None

            for annee in annees:
                # Récupération du montant total pour chaque année
                pta_record = PTA.objects.filter(
                    ref_dos=dos.libelle,
                    annee=annee
                ).aggregate(total_montant=Sum('montant'))

                montant = pta_record['total_montant'] or 0  # Utiliser 0 si aucun montant trouvé
                montants_par_annee.append(montant)

                # Récupération du code_activite uniquement lors de la première itération
                if not code_activite:
                    pta = PTA.objects.filter(ref_dos=dos.libelle).first()
                    if pta:
                        code_activite = pta.code_activite

            situation_data.append({
                "ref_dos": dos.ref_dos,
                "activite": code_activite or "N/A",  # Utiliser "N/A" si aucun code_activite n'est trouvé
                "annees": montants_par_annee
            })

        response_data = {
            "annees": annees,
            "situation_data": situation_data
        }

        return Response(response_data, status=status.HTTP_200_OK)
