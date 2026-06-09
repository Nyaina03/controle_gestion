# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TypeComptes
from .serializers import TypeComptesSerializer

class TypeComptesListView(APIView):
    def get(self, request, *args, **kwargs):
        types_comptes = TypeComptes.objects.all()  # Récupérer tous les types de tiers
        serializer = TypeComptesSerializer(types_comptes, many=True)  # Sérialiser les objets
        return Response(serializer.data)  # Retourner la réponse au format JSON

class TypeComptesCreateView(APIView):
    def post(self, request):
        serializer = TypeComptesSerializer(data=request.data)  # Créer un sérialiseur avec les données de la requête
        if serializer.is_valid():  # Vérifier si les données sont valides
            serializer.save()  # Sauvegarder le nouvel objet
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Retourner la réponse avec un code 201 (création réussie)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Retourner une erreur si le sérialiseur n'est pas valide
