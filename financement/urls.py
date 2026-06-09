
from django.urls import path
from .views import FinancementListView, FinancementCreateView

urlpatterns = [
    path('liste_financement/', FinancementListView.as_view(), name='liste_financement'),  # Pour lister les types de tiers
]
