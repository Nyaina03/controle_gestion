from rest_framework import serializers
from .models import CreationArticle

class CreationArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreationArticle
        fields = '__all__'
