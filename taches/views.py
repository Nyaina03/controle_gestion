from rest_framework import generics
from .models import Taches
from .serializers import TacheSerializer
from rest_framework.views import APIView

from django.utils import timezone
from datetime import timedelta
from rest_framework.response import Response
from rest_framework.views import APIView

# Liste des tâches et création d'une nouvelle tâche
class TacheListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister toutes les tâches ou en créer une nouvelle.
    """
    queryset = Taches.objects.all()  # Toutes les tâches dans la base de données
    serializer_class = TacheSerializer  # Sérialiseur associé

    def get(self, request, *args, **kwargs):
        """
        Récupérer la liste des tâches.
        """
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Ajouter une nouvelle tâche.
        """
        return super().post(request, *args, **kwargs)


# Détails, mise à jour et suppression d'une tâche
class TacheDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour ou supprimer une tâche spécifique.
    """
    queryset = Taches.objects.all()
    serializer_class = TacheSerializer

    def get(self, request, *args, **kwargs):
        """
        Récupérer les détails d'une tâche.
        """
        return super().get(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Mettre à jour une tâche existante.
        """
        return super().put(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Supprimer une tâche existante.
        """
        return super().delete(request, *args, **kwargs)


class TacheAlerteView(APIView):
    def get(self, request, *args, **kwargs):
        date_limite_proche = timezone.now().date() + timedelta(days=5)
        print(f"Date limite proche : {date_limite_proche}")  # Ajoutez cette ligne pour voir la date calculée
        taches = Taches.objects.filter(date_limite__lte=date_limite_proche, statut__in=['Non commencé', 'En cours'])
        print(f"Tâches trouvées : {taches}")  # Vérifiez ici les tâches récupérées
        serializer = TacheSerializer(taches, many=True)
        return Response(serializer.data)
