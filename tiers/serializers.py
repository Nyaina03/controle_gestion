from rest_framework import serializers
from .models import Tiers
from localites.models import Ville  # Importez le modèle de Ville
from typeDeTiers.models import TypeDeTiers  # Importez le modèle de TypeDeTiers

class TiersSerializer(serializers.ModelSerializer):
    # Ajout des champs personnalisés pour la ville et le type de tiers
    nom_ville = serializers.CharField(source='id_ville.nom_ville', read_only=True)
    type_tiers = serializers.CharField(source='id_type_tiers.type_tiers', read_only=True)

    class Meta:
        model = Tiers
        fields = '__all__'  # Vous pouvez aussi lister explicitement les champs si nécessaire
