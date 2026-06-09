from rest_framework import serializers
from .models import DepensesSIIG, TypeOperation

class DepensesSIIGSerializer(serializers.ModelSerializer):
    id_type_operation = serializers.PrimaryKeyRelatedField(queryset=TypeOperation.objects.all())

    class Meta:
        model = DepensesSIIG
        fields = ['id_type_operation', 'annee', 'num_engagement', 'code_programme', 'code_tiers', 'id_compte', 'objet', 'date_eng', 'grande_rubrique', 'montant', 'etat']
