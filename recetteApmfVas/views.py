from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import RecetteApmfVas
from .serializers import RecetteApmfVasSerializer
from comptes.models import Comptes  # Correct
from localites.models import Ville
from tiers.models import Tiers
from comptes.serializers import ComptesSerializer
from localites.serializers import VilleSerializer
from tiers.serializers import TiersSerializer


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


class RecetteApmfVasListView(APIView):
    def get(self, request):
        recettes = RecetteApmfVas.objects.all()
        serializer = RecetteApmfVasSerializer(recettes, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data

        try:
            montant_ht = float(data['montant_ht'])
            tva = float(data['tva'])
            montant_ttc = float(data['montant_ttc'])
        except (ValueError, KeyError):
            return Response({'error': 'Montant HT, TVA ou Montant TTC invalides ou manquants'}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(data.get('id_compte'), int) or not isinstance(data.get('id_ville'), int):
            return Response({'error': 'id_compte et id_ville doivent être des entiers'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RecetteApmfVasSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RecetteApmfVasDetailView(APIView):
    def get(self, request, pk):
        try:
            recette = RecetteApmfVas.objects.get(pk=pk)
        except RecetteApmfVas.DoesNotExist:
            return Response({'error': 'Recette Apmf Vas non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RecetteApmfVasSerializer(recette)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            recette = RecetteApmfVas.objects.get(pk=pk)
        except RecetteApmfVas.DoesNotExist:
            return Response({'error': 'Recette Apmf Vas non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RecetteApmfVasSerializer(recette, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            recette = RecetteApmfVas.objects.get(pk=pk)
        except RecetteApmfVas.DoesNotExist:
            return Response({'error': 'Recette Apmf Vas non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        recette.delete()
        return Response({'message': 'Recette Apmf Vas supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)

