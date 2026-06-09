from django.urls import path
from .views import TypeOperationView, TypeOperationDetailView

urlpatterns = [
    path('type_operations/', TypeOperationView.as_view(), name='type_operations'),
    path('type_operations/<int:id>/', TypeOperationDetailView.as_view(), name='type_operation_detail'),
]
