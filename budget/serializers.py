from rest_framework import serializers
from .models import Budget
from localites.models import Ville
from comptes.models import Comptes

class BudgetSerializer(serializers.ModelSerializer):

    code_compte = serializers.IntegerField(source='id_compte.code', read_only=True)
    nom_ville = serializers.CharField(source='id_ville.nom_ville', read_only=True)

    class Meta:
        model = Budget
        fields = '__all__'
