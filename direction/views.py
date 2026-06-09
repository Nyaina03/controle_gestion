from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Direction
from .serializers import DirectionSerializer

class DirectionView(APIView):
    def get(self, request):
        directions = Direction.objects.all()
        serializer = DirectionSerializer(directions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = DirectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            direction = Direction.objects.get(pk=pk)
        except Direction.DoesNotExist:
            return Response(
                {'error': 'Direction non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = DirectionSerializer(direction, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()  # Mettre à jour les données dans la base de données
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
