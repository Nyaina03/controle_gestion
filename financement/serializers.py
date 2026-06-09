from rest_framework import serializers
from .models import Financement

class FinancementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Financement
        fields = '__all__'
