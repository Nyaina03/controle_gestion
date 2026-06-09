from django.urls import path
from .views import DepensesSIIGView
from .views import DepensesSIIG5ans
from .views import DepensesSIIGDetailView
from .views import UpdateDepenseView
from .views import ChangementEtatView
from .views import ImportDonneeSiigView
from .views import VisualisationEngagements
from .views import EtatEngagementParCompte
from .views import EtatEngagementParTiers
from .views import SuiviDesEngagements

urlpatterns = [
    path('depenses_siig/', DepensesSIIGView.as_view(), name='depenses_siig'),
    path('depenses_siig_5ans/', DepensesSIIG5ans.as_view(), name='depenses_siig_5ans'),
    path('import_depenses/', ImportDonneeSiigView.as_view(), name='import_depenses'),  # Nouvelle route pour l'importation
    path('details_siig/<int:id_type_operation>/<int:annee>/<str:num_engagement>/', DepensesSIIGDetailView.as_view(), name='depenses-detail'),
    path('update_depense/<int:id>/', UpdateDepenseView.as_view(), name='update_depense'),
    path('changement_etat/<int:pk>/', ChangementEtatView.as_view(), name = 'changemnt_etat'),
    path('visualisation_engagement/<int:annee>/', VisualisationEngagements.as_view(), name='visualisation-engagement'),
    path('etat_engagement_par_compte/<int:id_compte>/<int:annee>/', EtatEngagementParCompte.as_view(), name='etat_engagement_par_compte'),
    path('etat_engagement_par_tiers/<int:id_compte>/<int:annee>/', EtatEngagementParTiers.as_view(), name='etat_engagement_par_tiers'),
    path('suivi_des_engagements/<int:id_compte>/<str:etat_engagement>/<int:annee>/', SuiviDesEngagements.as_view(), name='suivi_des_engagements'),
]
