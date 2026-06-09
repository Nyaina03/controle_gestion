from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TypeDepense
from .serializers import TypeDepenseSerializer

class TypeDepenseListView(APIView):
    def get(self, request, *args, **kwargs):
        type_depense = TypeDepense.objects.all()  # Récupérer tous les types de tiers
        serializer = TypeDepenseSerializer(type_depense, many=True)  # Sérialiser les objets
        return Response(serializer.data)  # Retourner la réponse au format JSON

class TypeDepenseCreateView(APIView):
    def post(self, request):
        serializer = TypeDepenseSerializer(data=request.data)  # Créer un sérialiseur avec les données de la requête
        if serializer.is_valid():  # Vérifier si les données sont valides
            serializer.save()  # Sauvegarder le nouvel objet
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Retourner la réponse avec un code 201 (création réussie)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Retourner une erreur si le sérialiseur n'est pas valide
