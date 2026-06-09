from rest_framework import serializers
from .models import Marchandises
from .models import NavireOperationnels
from localites.models import Ville
from .models import Stat
from django.db.models import Q
from datetime import date


class VillesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ville
        fields = '__all__' # ajuster les champs selon le modèle

class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stat
        fields = '__all__'  # ajuster les champs selon le modèle



class MarchandiseSerializer(serializers.ModelSerializer):
    port_ou_localite = serializers.PrimaryKeyRelatedField(queryset=Ville.objects.all())
    provenance_ou_destination = serializers.PrimaryKeyRelatedField(queryset=Ville.objects.all())
    code_stat = serializers.PrimaryKeyRelatedField(queryset=Stat.objects.all())
    id_navire = serializers.PrimaryKeyRelatedField(queryset=NavireOperationnels.objects.all())

    class Meta:
        model = Marchandises
        fields = [
            'id_marchandise',
            'importation_donnees',
            'port_ou_localite',
            'date_operation',
            'type_operation',
            'id_navire',
            'provenance_ou_destination',
            'type_stat',
            'quantite',
            'code_stat'
        ]


class NavireSerializer(serializers.ModelSerializer):
    localite = serializers.PrimaryKeyRelatedField(
        queryset=Ville.objects.all(),
        source='id_ville',
        write_only=True
    )
    id_ville = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = NavireOperationnels
        fields = ['id_navire', 'localite', 'id_ville', 'date_operation', 'navire', 'imm']





class MarchandiseEvoSerializer(serializers.ModelSerializer):
    # Sérialisation des champs du modèle Marchandises, y compris les relations
    code_stat = StatSerializer()  # Si vous souhaitez sérialiser les détails du code_stat
    port_ou_localite = serializers.StringRelatedField()  # Si vous voulez une chaîne pour la relation
    provenance_ou_destination = serializers.StringRelatedField()  # Idem pour l'autre relation
    
    class Meta:
        model = Marchandises
        fields = '__all__'

class EvolutionStatSerializer(serializers.Serializer):
    annees = serializers.ListField(child=serializers.IntegerField())
    statistiques = serializers.ListField(child=MarchandiseEvoSerializer())

   
