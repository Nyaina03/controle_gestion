
from django.urls import path
from .views import TypeComptesCreateView, TypeComptesListView

urlpatterns = [
    path('', TypeComptesCreateView.as_view(), name='ajouter_type_comptes'),  # Pour ajouter un type de tiers
    path('list/', TypeComptesListView.as_view(), name='liste_type_comptes'),  # Pour lister les types de tiers
]
