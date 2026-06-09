from django.urls import path
from .views import ComptesListView, ComptesDetailView

urlpatterns = [
    path('comptes/', ComptesListView.as_view(), name='comptes_list'),
    path('get-comptes/', ComptesListView.as_view(), name='get_comptes'),
    path('comptes/<int:pk>/', ComptesDetailView.as_view(), name='comptes_detail'),
]
