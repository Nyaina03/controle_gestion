from django.urls import path
from .views import PTAListView, PTADetailView, PTADeleteView

urlpatterns = [
    path('pta/', PTAListView.as_view(), name='pta_list'),
    path('pta/<str:code_strategique>/<str:code_activite>/', PTADetailView.as_view(), name='detail_pta'),
    path('update_pta/<int:id>/', PTADetailView.as_view(), name='uptade_pta'),
    path('delete_pta/<int:pk>/', PTADeleteView.as_view(), name='delete_pta'),
]
