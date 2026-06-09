from django.urls import path
from .views import UtilisateurListView, UtilisateurCreateView, LoginView
from .views import UtilisateurUpdateView

urlpatterns = [
    path('utilisateur/', UtilisateurListView.as_view(), name='utilisateur-list'),
    path('utilisateur/creer/', UtilisateurCreateView.as_view(), name='utilisateur-create'),
    path('utilisateur/login/', LoginView.as_view(), name='utilisateur-login'),
    path('utilisateur/<int:pk>/', UtilisateurUpdateView.as_view(), name='utilisateur-update'),
    
]
