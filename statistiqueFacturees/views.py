from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DRSN
from .models import DSM
from .models import DM
from .models import VAS
from .models import LocationTp
from .models import AAMMarins
from rest_framework.views import APIView
from .serializers import DRSNSerializer
from .serializers import DSMSerializer
from .serializers import DMSerializer
from .serializers import VASSerializer
from .serializers import AAMMarinSerializer
from .serializers import LocationTpSerializer


class DRSNListView(APIView):
    def get(self, request):
        drsn = DRSN.objects.all()
        serializer = DRSNSerializer(drsn, many=True)
        return Response(serializer.data)    

    def post(self, request):
        print("Données reçues:", request.data)
    
        serializer = DRSNSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DRSNDEtailView(APIView):
    def put(self, request, pk):
        try:
            drsn = DRSN.objects.get(pk=pk)
        except DRSN.DoesNotExist:
            return Response(
                {'error': 'DRSN non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Sérialisation des données mises à jour
        serializer = DRSNSerializer(drsn, data=request.data, partial=False)

        if serializer.is_valid():
            serializer.save()  # Mettre à jour les données dans la base de données
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            drsn = DRSN.objects.get(pk=pk)
        except DRSN.DoesNotExist:
            return Response(
                {'error': 'DRSN non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        drsn.delete()  # Supprimer le compte
        return Response(
            {'message': 'DRSN supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )


class DSMListView(APIView):
    def get(self, request):
        dsm = DSM.objects.all()
        serializer = DSMSerializer(dsm, many=True)
        return Response(serializer.data)    

    def post(self, request):
        print("Données reçues:", request.data)
    
        serializer = DSMSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DSMDetailView(APIView):
    def put(self, request, pk):
        try:
            dsm = DSM.objects.get(pk=pk)
        except DSM.DoesNotExist:
            return Response(
                {'error': 'DSM non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Sérialisation des données mises à jour
        serializer = DSMSerializer(dsm, data=request.data, partial=False)

        if serializer.is_valid():
            serializer.save()  # Mettre à jour les données dans la base de données
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            dsm = DSM.objects.get(pk=pk)
        except DSM.DoesNotExist:
            return Response(
                {'error': 'DSM non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        dsm.delete()  # Supprimer le compte
        return Response(
            {'message': 'DSM supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )


class DMListView(APIView):
    def get(self, request):
        dm = DM.objects.all()
        serializer = DMSerializer(dm, many=True)
        return Response(serializer.data)    

    def post(self, request):
        print("Données reçues:", request.data)
    
        serializer = DMSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DMDetailView(APIView):
    def put(self, request, pk):
        try:
            dm = DM.objects.get(pk=pk)
        except DM.DoesNotExist:
            return Response(
                {'error': 'DM non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Sérialisation des données mises à jour
        serializer = DMSerializer(dm, data=request.data, partial=False)

        if serializer.is_valid():
            serializer.save()  # Mettre à jour les données dans la base de données
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            dm = DM.objects.get(pk=pk)
        except DM.DoesNotExist:
            return Response(
                {'error': 'DM non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        dm.delete()  # Supprimer le compte
        return Response(
            {'message': 'DM supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )


class VASListView(APIView):
    def get(self, request):
        vas = VAS.objects.all()
        serializer = VASSerializer(vas, many=True)
        return Response(serializer.data)    

    def post(self, request):
        print("Données reçues:", request.data)
    
        serializer = VASSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VASDetailView(APIView):
    def put(self, request, pk):
        try:
            vas = VAS.objects.get(pk=pk)
        except VAS.DoesNotExist:
            return Response(
                {'error': 'VAS non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Sérialisation des données mises à jour
        serializer = VASSerializer(vas, data=request.data, partial=False)

        if serializer.is_valid():
            serializer.save()  # Mettre à jour les données dans la base de données
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            vas = VAS.objects.get(pk=pk)
        except VAS.DoesNotExist:
            return Response(
                {'error': 'VAS non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        vas.delete()  # Supprimer le compte
        return Response(
            {'message': 'VAS supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )


class AAMListView(APIView):
    def get(self, request):
        aam_marins = AAMMarins.objects.all()
        serializer = AAMMarinSerializer(aam_marins, many=True)
        return Response(serializer.data)    

    def post(self, request):
        print("Données reçues:", request.data)
    
        serializer = AAMMarinSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AAMDetailView(APIView):
    def put(self, request, pk):
        try:
            aam_marins = AAMMarins.objects.get(pk=pk)
        except AAMMarins.DoesNotExist:
            return Response(
                {'error': 'AAM non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Sérialisation des données mises à jour
        serializer = AAMMarinSerializer(aam_marins, data=request.data, partial=False)

        if serializer.is_valid():
            serializer.save()  # Mettre à jour les données dans la base de données
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            aam_marins = AAMMarins.objects.get(pk=pk)
        except AAMMarins.DoesNotExist:
            return Response(
                {'error': 'AAM non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        aam_marins.delete()  # Supprimer le compte
        return Response(
            {'message': 'AAM supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )

class LocationTpListView(APIView):
    def get(self, request):
        locations = LocationTp.objects.all()
        serializer = LocationTpSerializer(locations, many=True)
        return Response(serializer.data)    

    def post(self, request):
        print("Données reçues:", request.data)
    
        serializer = LocationTpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LocationDetailView(APIView):
    def put(self, request, pk):
        try:
            location = LocationTp.objects.get(pk=pk)
        except LocationTp.DoesNotExist:
            return Response(
                {'error': 'Location non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Sérialisation des données mises à jour
        serializer = LocationTp(location, data=request.data, partial=False)

        if serializer.is_valid():
            serializer.save()  # Mettre à jour les données dans la base de données
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            location = LocationTp.objects.get(pk=pk)
        except LocationTp.DoesNotExist:
            return Response(
                {'error': 'Location non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        location.delete()  # Supprimer le compte
        return Response(
            {'message': 'Location supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )
        
