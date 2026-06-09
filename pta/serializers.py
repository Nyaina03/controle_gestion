from rest_framework import serializers
from .models import PTA
from direction.models import Direction
from dos.models import Dos 

class PTASerializer(serializers.ModelSerializer):
    reference_dos = serializers.CharField(source='ref_dos.ref_dos', read_only=True)
    nom_direction = serializers.CharField(source='id_direction.nom_direction', read_only=True)

    class Meta:
        model = PTA
        fields = '__all__'
