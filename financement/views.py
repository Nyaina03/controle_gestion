from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Financement
from .serializers import FinancementSerializer

class FinancementListView(APIView):
    def get(self, request, *args, **kwargs):
        financement = Financement.objects.all()  # Récupérer tous les types de tiers
        serializer = FinancementSerializer(financement, many=True)  # Sérialiser les objets
        return Response(serializer.data)  # Retourner la réponse au format JSON

class FinancementCreateView(APIView):
    def post(self, request):
        serializer = FinancementSerializer(data=request.data)  # Créer un sérialiseur avec les données de la requête
        if serializer.is_valid():  # Vérifier si les données sont valides
            serializer.save()  # Sauvegarder le nouvel objet
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Retourner la réponse avec un code 201 (création réussie)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Retourner une erreur si le sérialiseur n'est pas valide
