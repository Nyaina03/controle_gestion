from django.urls import path
from .views import CreationArticleView, CreationArticleDetailView, EtatParFamille
from .views import EtatBesoinParService
from .views import TotalParFamille
from .views import EtatParFamilleParDemandeur
from .views import TotalParDemandeur

urlpatterns = [
    path('creation_article/', CreationArticleView.as_view(), name='creation_article_list'),
    path('creation_article/<int:pk>/', CreationArticleDetailView.as_view(), name='creation_article_detail'),
    path('etat_besoin_par_service/<int:annee>/<int:direction>/', EtatBesoinParService.as_view(), name='etat_besoin_par_service'),  
    path('etat_par_famille/<int:annee>/<int:code_famille>/', EtatParFamille.as_view(), name='etat_par_famille'),
    path('total_par_famille/<int:annee>/', TotalParFamille.as_view(), name='total_par_famille'),
    path('etat_par_famille_par_demandeur/<int:direction>/<int:annee>/', EtatParFamilleParDemandeur.as_view(), name='etat_par_famille_par_demandeur'),
    path('total_par_demandeur/<int:annee>/', TotalParDemandeur.as_view(), name ='total_par_demandeur'),
]
