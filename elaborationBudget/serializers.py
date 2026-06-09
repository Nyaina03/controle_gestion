from rest_framework import serializers
from .models import BesoinParService
from .models import ModificationSuppressionBudget
from .models import AmenagementBudget

class BesoinParServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BesoinParService
        fields = ['annee_besoin', 'id_demandeur', 'id_creation_article', 'quantite']


class ModificationSuppressionBudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModificationSuppressionBudget
        fields = '__all__'


class AmenagementBudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmenagementBudget
        fields = ['id_amenagement', 'annee', 'id_compte', 'id_budget', 'modif_plus', 'modif_moins', 'date_programme_emploi']

