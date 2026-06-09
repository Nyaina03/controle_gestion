from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import PTA
from .models import HistoriquePTA
from .serializers import PTASerializer
from django.shortcuts import get_object_or_404
import logging
from datetime import datetime
from django.shortcuts import get_object_or_404
import json
from django.http import JsonResponse

from rest_framework.decorators import api_view
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt



class PTAListView(APIView):
    def get(self, request):
        pta = PTA.objects.all()
        serializer = PTASerializer(pta, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("Données reçues:", request.data)
        
        # Vérification des types
        if not isinstance(request.data.get('id_direction'), int):
            return Response({'error': 'id_direction doit être un entier'}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(request.data.get('ref_dos'), int):
            return Response({'error': 'ref_dos doit être un entier'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PTASerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PTADetailView(APIView):
    def get(self, request, code_strategique, code_activite):
        try:
            # Récupérer les pta filtrés selon les paramètres d'URL
            queryset = PTA.objects.all()

            if code_strategique:
                queryset = queryset.filter(code_strategique=code_strategique)
            if code_activite:
                queryset = queryset.filter(code_activite=code_activite)

            # Vérifier si des résultats existent
            if not queryset.exists():
                return Response({"error": "Aucun  PTA avec les critères donnés."},
                                status=status.HTTP_404_NOT_FOUND)

            # Sérialisation des résultats
            serializer = PTASerializer(queryset, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Erreur lors de la récupération des PTA: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#misa jour et historisation pta
    def put(self, request, id):
        try:
            # Récupérer la dépense existante (depense) par son ID
            pta = get_object_or_404(PTA, pk=id)
            print("PTA trouvée:", pta)

            # Récupérer les données du corps de la requête PUT
            new_data = json.loads(request.body)
            print("Données reçues pour mise à jour:", new_data)

            # Validation initiale des champs obligatoires
            required_fields = ['id_direction']
            for field in required_fields:
                if field in new_data and not new_data[field]:
                    return JsonResponse(
                        {'success': False, 'message': f"Le champ {field} est obligatoire et ne peut être vide."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Sauvegarder l'historique avant la mise à jour
            HistoriquePTA.objects.create(
                id_pta=pta.id_pta,
                annee=pta.annee,
                code_strategique = pta.code_strategique,
                code_activite = pta.code_activite,
                libelle = pta.libelle,
                montant = pta.montant,
                id_direction = pta.id_direction,
                code_programme= pta.code_programme,
                ref_dos = pta.ref_dos,
                date_misajour= datetime.now(),

            )
            print("Historique pta sauvegardé.")

            # Mise à jour de la dépense
            serializer = PTASerializer(pta, data=new_data)  # Correction ici, il faut utiliser new_data
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("Erreur interne:", str(e))
            return JsonResponse({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PTADeleteView(APIView):    
    def delete(self, request, pk):
        try:
            pta = PTA.objects.get(pk=pk)
        except PTA.DoesNotExist:
            return Response(
                {'error': 'PTA non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        pta.delete()  # Supprimer le pta
        return Response(
            {'message': 'Pta supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )

        
