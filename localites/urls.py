from django.urls import path
from .views import VilleListView, VilleDetailView

urlpatterns = [
    path('villes/', VilleListView.as_view(), name='ville-list'),
    path('villes/<int:id>/', VilleDetailView.as_view(), name='ville-detail'),  # Nouvelle route
]
