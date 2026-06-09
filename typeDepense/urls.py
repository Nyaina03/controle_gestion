
from django.urls import path
from .views import TypeDepenseListView, TypeDepenseCreateView

urlpatterns = [
    path('liste_type_depense/', TypeDepenseListView.as_view(), name='liste_type_depense'),  # Pour lister les types de tiers
]
