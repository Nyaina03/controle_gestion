from django.urls import path
from .views import DirectionView

urlpatterns = [
    path('liste_direction/', DirectionView.as_view(), name='liste_direction'),
    
]
