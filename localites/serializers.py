from rest_framework import serializers
from .models import Ville

class VilleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ville
        fields = ['id_ville', 'nom_ville', 'code_ville', 'type_ville']
