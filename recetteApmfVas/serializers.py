from rest_framework import serializers
from .models import RecetteApmfVas
from localites.models import Ville 
from comptes.models import Comptes 

class RecetteApmfVasSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecetteApmfVas
        fields = '__all__'