from rest_framework import serializers
from .models import Dos

class DosSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dos
        fields = '__all__'
