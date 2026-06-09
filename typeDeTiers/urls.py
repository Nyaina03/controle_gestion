
from django.urls import path
from .views import TypeDeTiersCreateView, TypeDeTiersListView

urlpatterns = [
    path('', TypeDeTiersCreateView.as_view(), name='ajouter_type_tiers'),  # Pour ajouter un type de tiers
    path('list/', TypeDeTiersListView.as_view(), name='liste_type_tiers'),  # Pour lister les types de tiers
]
