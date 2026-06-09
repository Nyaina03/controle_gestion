from django.urls import path
from .views import RecetteApmfVasDetailView
from .views import RecetteApmfVasListView

urlpatterns = [
    path('recetteApmfVas/', RecetteApmfVasListView.as_view(), name='recetteApmfVas-list'),
    path('recetteApmfVas/<int:pk>/', RecetteApmfVasDetailView.as_view(), name='recetteApmfVas-detail')

]
