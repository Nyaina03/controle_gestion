from rest_framework import serializers
from .models import TypeDepense

class TypeDepenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeDepense
        fields = '__all__'
