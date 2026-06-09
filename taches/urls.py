from django.urls import path
from .views import TacheListCreateView, TacheDetailView, TacheAlerteView

urlpatterns = [
    path('taches/', TacheListCreateView.as_view(), name='tache-list-create'),  
    path('taches/<int:pk>/', TacheDetailView.as_view(), name='tache-detail'),  
    path('taches/alerte/', TacheAlerteView.as_view(), name='tache-alerte'),  
]

