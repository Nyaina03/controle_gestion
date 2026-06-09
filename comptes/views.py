from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Comptes
from .serializers import ComptesSerializer

class ComptesListView(APIView):

    def get(self, request):
        comptes = Comptes.objects.all()
        serializer = ComptesSerializer(comptes, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Débogage des données reçues
        print("Données reçues:", request.data)

        # Extraire les données nécessaires
        code = request.data.get('code')
        libelle = request.data.get('libelle')
        id_type_compte = request.data.get('id_type_compte')

        # Vérification de la validité des données envoyées
        if not code or not libelle or not id_type_compte:
            return Response(
                {'error': 'Les champs code, libelle et id_type_compte sont requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Sérialisation et sauvegarde
        serializer = ComptesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Enregistrer dans la base de données
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Si les données sont invalides, retourner les erreurs
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def get_comptes(request):
        # Récupérer tous les comptes sauf ceux avec id_compte = 1 ou id_compte = 2
        comptes = Compte.objects.exclude(id_compte__in=[1, 2])

        # Loguer les comptes récupérés pour débogage
        print(comptes)

        # Préparer les données à renvoyer sous forme de liste de dictionnaires
        comptes_data = []
        for compte in comptes:
            comptes_data.append({
                "id_compte": compte.id_compte,  # Utilisation correcte de id_compte
                "code": compte.code,
                "libelle": compte.libelle,
                "id_type_compte": compte.id_type_compte
            })

        # Retourner les données sous forme de JSON
        return JsonResponse(comptes_data, safe=False)




class ComptesDetailView(APIView):

    def put(self, request, pk):
        try:
            compte = Comptes.objects.get(pk=pk)
        except Comptes.DoesNotExist:
            return Response(
                {'error': 'Compte non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Sérialisation des données mises à jour
        serializer = ComptesSerializer(compte, data=request.data, partial=False)

        if serializer.is_valid():
            serializer.save()  # Mettre à jour les données dans la base de données
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            compte = Comptes.objects.get(pk=pk)
        except Comptes.DoesNotExist:
            return Response(
                {'error': 'Compte non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        compte.delete()  # Supprimer le compte
        return Response(
            {'message': 'Compte supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )
