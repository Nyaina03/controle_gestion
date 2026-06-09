from rest_framework import serializers
from .models import TypeDeTiers

class TypeDeTiersSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeDeTiers
        fields = '__all__'
