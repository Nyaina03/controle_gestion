from django.urls import path
from .views import DRSNListView, DRSNDEtailView
from .views import DSMListView, DSMDetailView
from .views import DMListView, DMDetailView
from .views import VASListView, VASDetailView
from .views import AAMListView, AAMDetailView
from .views import LocationTpListView, LocationDetailView

urlpatterns = [
    path('drsn/', DRSNListView.as_view(), name = 'ajouter_drsn'),
    path('drsn/<int:pk>/', DRSNDEtailView.as_view(), name = 'drsn'),
    path('dsm/', DSMListView.as_view(), name = 'ajouter_dsm'),
    path('dsm/<int:pk>/', DSMDetailView.as_view(), name = 'dsm'),
    path('dm/', DMListView.as_view(), name = 'ajouter_dm'),
    path('dm/<int:pk>/', DMDetailView.as_view(), name = 'ajouter_dm'),
    path('vas/', VASListView.as_view(), name = 'vas_dm'),
    path('vas/<int:pk>/', VASDetailView.as_view(), name = 'vas_dm'),
    path('aam_marins/', AAMListView.as_view(), name = 'aam_marins'),
    path('aam_marins/<int:pk>/', AAMDetailView.as_view(), name = 'aam_marins'),
    path('location_tp/', LocationTpListView.as_view(), name = 'location_tp'),
    path('location_tp/<int:pk>/', LocationDetailView.as_view(), name = 'location_tp'),

]
