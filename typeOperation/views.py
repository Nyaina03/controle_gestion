from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TypeOperation
from .serializers import TypeOperationSerializer

class TypeOperationView(APIView):
    def get(self, request):
        type_operations = TypeOperation.objects.all()
        serializer = TypeOperationSerializer(type_operations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TypeOperationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TypeOperationDetailView(APIView):
    def get(self, request, id):
        try:
            type_operation = TypeOperation.objects.get(pk=id)
        except TypeOperation.DoesNotExist:
            return Response({'error': 'TypeOperation not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TypeOperationSerializer(type_operation)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        try:
            type_operation = TypeOperation.objects.get(pk=id)
        except TypeOperation.DoesNotExist:
            return Response({'error': 'TypeOperation not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TypeOperationSerializer(type_operation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            type_operation = TypeOperation.objects.get(pk=id)
        except TypeOperation.DoesNotExist:
            return Response({'error': 'TypeOperation not found'}, status=status.HTTP_404_NOT_FOUND)
        
        type_operation.delete()
        return Response({'message': 'TypeOperation deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
