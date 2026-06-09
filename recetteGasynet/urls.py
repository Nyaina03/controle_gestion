from django.urls import path
from .views import RecetteGasyNetListView, RecetteGasyNetDetailView, RecetteGasyNetImportView, EvolutionSur5AnsView

urlpatterns = [
    path('recetteGasynet/', RecetteGasyNetListView.as_view(), name='recettegasynet_list'),
    path('recetteGasynet/<int:pk>/', RecetteGasyNetDetailView.as_view(), name='recettegasynet_detail'),
    path('recetteGasynet/import/', RecetteGasyNetImportView.as_view(), name='import_recette_gasynet'),
    path('recetteGasynet/evolution/', EvolutionSur5AnsView.as_view(), name='evolution_5_ans'),
]
