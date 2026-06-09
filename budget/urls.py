from django.urls import path
from .views import BudgetListView, BudgetDetailView, VisualisationInvestissement,VisualisationFonctionnement, BudgetParCompte
from .views import TableauEquilibreFinancier
from django.urls import path
from .views import DecaissementParProjet
from .views import ExportPDFTableauEquilibreFinancier
from .views import SituationBudgetaire 
from .views import AnalyseDesEcarts
from .views import VariationGlobale
from .views import ProgrammeDemploi
from .views import BudgetList5ans
from .views import VisualisationInvestissement5ans
from .views import VisualisationFonctionnement5ans
from .views import VisualisationInvestissementMensuelle
from .views import VisualisationFonctionnementMensuelle

urlpatterns = [
    path('budget/', BudgetListView.as_view(), name='budget_list'),
    path('budget/<int:pk>/', BudgetDetailView.as_view(), name='budget_detail'),
   
    path('visualisation_investissement/', VisualisationInvestissement.as_view(), name='visualisation_investissement'),
    path('visualisation_investissement_5ans/', VisualisationInvestissement5ans.as_view(), name='visualisation_investissement_5ans'),
    path('visualisation_investissement_mensuelle/', VisualisationInvestissementMensuelle.as_view(), name='visualisation_investissement_mensuelle'),
    
    path('visualisation_fonctionnement/', VisualisationFonctionnement.as_view(), name='visualisation_fonctionnement'),
    path('visualisation_fonctionnement_5ans/', VisualisationFonctionnement5ans.as_view(), name='visualisation_fonctionnement_5ans'),
    path('visualisation_fonctionnement_mensuelle/', VisualisationFonctionnementMensuelle.as_view(), name='visualisation_fonctionnement_mensuelle'),

    path('budget_par_compte/', BudgetParCompte.as_view(), name='budget_par_compte'),
    path('tableau_equilibre_financier/', TableauEquilibreFinancier.as_view(), name='tableau_equilibre'),
    path('export_pdf/', ExportPDFTableauEquilibreFinancier.as_view(), name='export_pdf'),
    path('decaissement_par_projet/<int:annee>/', DecaissementParProjet.as_view(), name='decaissement_projet'),
    path('situation_budgetaire/<int:annee>/', SituationBudgetaire.as_view(), name='situation_budgetaire'),
    path('analyse_des_ecarts/<int:annee>/', AnalyseDesEcarts.as_view(), name='analyse_des_ecarts' ),
    path('variation_globale/<int:annee>/', VariationGlobale.as_view(), name='variation_globale'),
    path('programme_emploi/<int:annee>/', ProgrammeDemploi.as_view(), name='programme_emploi'),
    path('budget_5ans/<int:annee_debut>/', BudgetList5ans.as_view(), name='budget_5ans'),

]
