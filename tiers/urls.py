from django.urls import path
from .views import TiersListView
from .views import TiersDetailView

urlpatterns = [
    path('tiers/', TiersListView.as_view(), name='tiers-list'),
    path('tiers/<str:pk>/', TiersDetailView.as_view(), name='tiers-detail')

]
