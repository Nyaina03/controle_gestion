from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Tiers
from .serializers import TiersSerializer

class TiersListView(APIView):

    def generate_custom_id(self, nom, id_type_tiers, id_ville):
        """
        Génère un ID personnalisé pour un Tiers en fonction des paramètres.
        L'ID est basé sur le type de tiers, la ville et l'initiale du nom,
        mais l'incrémentation des 4 derniers chiffres est indépendante.
        """
        type_code = "CLT" if id_type_tiers == 1 else "FRS"
        letter_code = ord(nom[0].upper()) - ord('A') + 1  # Convertit 'A' en 1, 'B' en 2, etc.
        ville_code = f"{int(id_ville):02}"  # Formatage de l'ID ville sur 2 chiffres

        # Calcul du numéro séquentiel pour les 4 derniers chiffres
        latest_tier = Tiers.objects.all().order_by('-id_tiers').first()

        if latest_tier:
            # Extraire la séquence à partir de l'ID, en excluant les lettres et autres éléments
            # Exemple : CLT01010001 => on prend les 4 derniers chiffres après le code
            last_sequence = int(latest_tier.id_tiers[-4:])  # On prend les 4 derniers chiffres de l'ID
            next_sequence = f"{last_sequence + 1:04}"  # Incrémente et garde 4 chiffres
        else:
            next_sequence = "0001"  # Premier enregistrement, commencer à 0001

        # Retourner l'ID formaté : Type + Ville + Lettre + Séquence
        return f"{type_code}{ville_code}{letter_code:02}{next_sequence}"

    def get(self, request):
        tiers = Tiers.objects.all()
        serializer = TiersSerializer(tiers, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Debugging des données reçues
        print("Données reçues:", request.data)

        # Extraire les données nécessaires
        nom = request.data.get('nom')
        id_type_tiers = request.data.get('id_type_tiers')
        id_ville = request.data.get('id_ville')
        
        # Vérification de la validité des données envoyées
        if not nom or not id_type_tiers or not id_ville:
            return Response(
                {'error': 'Les champs nom, id_type_tiers et id_ville sont requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Générer l'ID personnalisé
        id_tiers = self.generate_custom_id(nom, int(id_type_tiers), int(id_ville))
        request.data['id_tiers'] = id_tiers  # Ajouter l'ID généré aux données
        
        # Sérialisation et sauvegarde
        serializer = TiersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TiersDetailView(APIView):
    
    def put(self, request, pk):
        try:
            tier = Tiers.objects.get(pk=pk)
        except Tiers.DoesNotExist:
            return Response({'error': 'Tiers not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TiersSerializer(tier, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            tier = Tiers.objects.get(pk=pk)
            tier.delete()
            return Response({'message': 'Tiers supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
        except Tiers.DoesNotExist:
            return Response({'error': 'Tiers not found'}, status=status.HTTP_404_NOT_FOUND)
