from rest_framework import serializers
from .models import Taches

class TacheSerializer(serializers.ModelSerializer):
    class Meta:
        model = Taches
        fields = ['id_tache', 'titre', 'descriptions', 'date_debut', 'date_limite', 'statut', 'id_utilisateur', 'created_at', 'updated_at']
