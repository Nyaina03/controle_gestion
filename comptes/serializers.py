from rest_framework import serializers
from .models import Comptes
from typeComptes.models import TypeComptes

class ComptesSerializer(serializers.ModelSerializer):
    type_compte = serializers.CharField(source='id_type_compte.type_compte', read_only=True)
    class Meta:
        model = Comptes
        fields = ['id_compte', 'code', 'libelle', 'id_type_compte', 'type_compte']
