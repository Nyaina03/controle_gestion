from django.urls import path
from .views import MarchandiseListView
from .views import NavireListView
from .views import EscalesParMoisView
from .views import StatListView
from .views import EvolutionStatView
from .views import EvoStatSur5
from .views import StatistiquesParVille
from .views import EvoStatMensuelleParVille
from .views import StatistiqueGlobaleFacturee
from .views import NaviresOperationnels
from .views import MsesTransportees
from .views import Passagers
from .views import NaviresEcarts
from .views import GestionMarchandise
from .views import GestionMarchandiseGlobale
from .views import GestionPassagers

urlpatterns =[
    path('marchandises/', MarchandiseListView.as_view(), name='ajouter_marchandise'),
    path('navires/', NavireListView.as_view(), name='ajouter_navire'),
    path('escales_par_mois/', EscalesParMoisView.as_view(), name='escales_par_mois'),
    path('evo_stat_sur_5/', EvoStatSur5.as_view(), name='evo_stat_sur_5'),
    path('stat/', StatListView.as_view(), name='stat'),
    path('evolution-statistiques/', EvolutionStatView.as_view(), name='evolution-statistiques'),
    path('stat_par_ville/', StatistiquesParVille.as_view(), name='stat_par_ville'),
    path('evo_stat_mensuelle_par_ville/', EvoStatMensuelleParVille.as_view(), name='evo_stat_mensuelle_par_ville'),
    path('statistique_globale_facturee/', StatistiqueGlobaleFacturee.as_view(), name='statistique_globale_facturee'),
    path('navires_operationnels/', NaviresOperationnels.as_view(), name='navires_operationnels'),
    path('mses_transportees/', MsesTransportees.as_view(), name='mses_transportees'),
    path('passagers/', Passagers.as_view(), name='passagers'),
    path('navires_ecarts/', NaviresEcarts.as_view(), name='navires_ecarts'),
    path('gestion_marchandise/', GestionMarchandise.as_view(), name='gestion_marchandises'),
    path('gestion_marchandise_globale/', GestionMarchandiseGlobale.as_view(), name='gestion_marchandises_globale'),
    path('gestion_passagers/', GestionPassagers.as_view(), name='gestion_passagers'),
]


