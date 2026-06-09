from rest_framework import serializers
from .models import TypeOperation

class TypeOperationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeOperation
        fields = '__all__'
