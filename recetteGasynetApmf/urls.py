from django.urls import path
from .views import EtatGlobaleView
from .views import AnalyseEcartView
from .views import EcartAnnuelView

urlpatterns = [
    path('etat-global/', EtatGlobaleView.as_view(), name='etat-global'),
    path('analyse_des_ecarts/', AnalyseEcartView.as_view(), name='analyse_des_ecarts'),
    path('ecart_annuel/', EcartAnnuelView.as_view(), name='ecart_annuel'),
]
