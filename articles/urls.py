from django.urls import path
from .views import ArticleView

urlpatterns = [
    path('liste_article/', ArticleView.as_view(), name= 'liste_article')
]
