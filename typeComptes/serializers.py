from rest_framework import serializers
from .models import TypeComptes

class TypeComptesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeComptes
        fields = '__all__'
