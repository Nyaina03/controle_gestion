from django.urls import path
from .views import RecetteAllApmfDetailView
from .views import RecetteAllApmfListView
from .views import TableauSynoptiqueView
from .views import NumeroStatistiques
from .views import EvolutionMensuelleGlobale
from .views import EvolutionMensuelleParCompte
from .views import EvolutionParVilleSur5Ans
from .views import EvolutionParCompteSur5Ans

urlpatterns = [
    path('recetteAllApmf/', RecetteAllApmfListView.as_view(), name='recetteAllApmf-list'),
    path('etat-factures/', RecetteAllApmfListView.as_view(), name='etat-factures'),
    path('tableau-synoptique/', TableauSynoptiqueView.as_view(), name='tableau-synoptique'),
    path('recetteAllApmf/<int:pk>/', RecetteAllApmfDetailView.as_view(), name='recetteAllApmf-detail'),
    path('get_num_facture/', NumeroStatistiques.as_view(), name='get_num_facture'),
    path('evolution_mensuelle_globale/', EvolutionMensuelleGlobale.as_view(), name='evolution_mensuelle_globale'),
    path('evolution_mensuelle_par_compte/', EvolutionMensuelleParCompte.as_view(), name='evolution_mensuelle_par_compte'),
    path('evolution_par_ville_sur5Ans/', EvolutionParVilleSur5Ans.as_view(), name='evolution_par_ville_sur_5_ans'),
    path('evolution_par_compte_sur5Ans/', EvolutionParCompteSur5Ans.as_view(), name='evolution_par_compte_sur_5_ans'),

]
