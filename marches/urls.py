from django.urls import path
from .views import (
    MarcheListView,
    MarcheDetailView,
    AttachementParCompteView,
    VisualisationDesMarches,
    AttachementParProjet,
    SuiviDecaissements,  
    HistoriqueDePaiement,
    AnalyseDesEcarts,
    ExecutionPTA,
    ExecutionPTAParDirection

)

urlpatterns = [
    path('liste_marches/', MarcheListView.as_view(), name='listes_marches'),
    path('marches/<int:annee>/<str:num_marche>', MarcheDetailView.as_view(), name='detail_marche'),
    path('update_marche/<int:id>/', MarcheDetailView.as_view(), name='update_marche'),
    path('attachement_par_compte/', AttachementParCompteView.as_view(), name='attachement_par_compte'),
    path('visualisation_des_marches/<int:annee>/', VisualisationDesMarches.as_view(), name='visualisation_des_marches'),
    path('attachement_par_projet/<int:id_compte>/<int:annee>/', AttachementParProjet.as_view(), name='attachement_par_projet'),
    path('suivi_decaissement/<int:annee>/', SuiviDecaissements.as_view(), name='suivi_decaissement'),
    path('historique_paiement/<int:annee>/', HistoriqueDePaiement.as_view(), name='historique'),
    path('analyse_des_ecarts/<int:annee>/', AnalyseDesEcarts.as_view(), name='analyse_des_ecarts'),
    path('execution_pta/', ExecutionPTA.as_view(), name='execution_pta'),  
    path('execution_pta_par_direction/', ExecutionPTAParDirection.as_view(), name='execution_pta_par_direction'),  
]

