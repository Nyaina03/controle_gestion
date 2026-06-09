from django.urls import path
from .views import BesoinParServiceView, ModificationSuppressionView,AmenagementBudgetView

urlpatterns = [
    path('besoin_par_service/', BesoinParServiceView.as_view(), name='besoin_par_service'),
    path('projet_par_compte/<int:id_compte>/<int:annee>/', ModificationSuppressionView.as_view(), name='projet_par_compte'),  # For GET with parameters
    path('ajouter_budget_attachement/', ModificationSuppressionView.as_view(), name='ajouter_budget_attachement'), 
    path('amenagement_budget/', AmenagementBudgetView.as_view(), name='amenagement_budget'),

]
