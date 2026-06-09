from django.urls import path
from .views import DosListView, DosDetailsiew, ExecutionDos, SituationDos

urlpatterns = [
    path('dos/', DosListView.as_view(), name='ajouter_dos'), 
    path('dos/<int:pk>/', DosDetailsiew.as_view(), name='modifier_dos'), 
    path('execution_dos/', ExecutionDos.as_view(), name='execution_dos'),  
    path('situation_dos/', SituationDos.as_view(), name='situation_dos'),  

]
