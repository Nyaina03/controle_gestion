from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Ville
from .serializers import VilleSerializer

class VilleListView(APIView):
    def get(self, request):
        villes = Ville.objects.all()
        serializer = VilleSerializer(villes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VilleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VilleDetailView(APIView):
    def get_object(self, id):
        try:
            return Ville.objects.get(id_ville=id)
        except Ville.DoesNotExist:
            return None

    def put(self, request, id):
        ville = self.get_object(id)
        if not ville:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = VilleSerializer(ville, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        ville = self.get_object(id)
        if not ville:
            return Response(status=status.HTTP_404_NOT_FOUND)
        ville.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
