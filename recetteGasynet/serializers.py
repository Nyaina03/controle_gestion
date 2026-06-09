from rest_framework import serializers
from .models import RecetteGasyNet
from localites.models import Ville 
from comptes.models import Comptes 

class RecetteGasyNetSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecetteGasyNet
        fields = ['id_recette_gasynet', 'date_recette', 'id_compte', 'bureau_douane', 'id_ville', 'montant_ht', 'tva']