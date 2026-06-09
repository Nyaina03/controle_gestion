from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Utilisateur
from .serializers import UtilisateurSerializer
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import Group
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password



class UtilisateurListView(APIView):
    """
    Vue pour récupérer tous les utilisateurs.
    """
    def get(self, request, *args, **kwargs):
        utilisateurs = Utilisateur.objects.all()  # Récupérer tous les utilisateurs
        serializer = UtilisateurSerializer(utilisateurs, many=True)  # Sérialiser les objets
        return Response(serializer.data)  # Retourner les données JSON



class UtilisateurCreateView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        raw_password = data.get('mdp')

        if not raw_password:
            return Response({"error": "Le mot de passe est requis"}, status=status.HTTP_400_BAD_REQUEST)

        utilisateur = Utilisateur(
            mail=data.get('mail'),
            statut=data.get('statut', 5)
        )
        utilisateur.set_password(raw_password)  # Hacher le mot de passe ici
        utilisateur.save()

        serializer = UtilisateurSerializer(utilisateur)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class LoginView(APIView):
    def post(self, request):
        email = request.data.get('mail')
        password = request.data.get('mdp')

        if not email or not password:
            return Response({"error": "Email et mot de passe sont requis"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            utilisateur = Utilisateur.objects.get(mail=email)

            # Vérifie le mot de passe correctement
            if utilisateur.check_password(password):
                refresh = RefreshToken.for_user(utilisateur)  # Correction ici
                access_token = str(refresh.access_token)

                return Response({
                    "message": "Connexion réussie",
                    "statut": utilisateur.statut,
                    "access_token": access_token
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Mot de passe incorrect"}, status=status.HTTP_401_UNAUTHORIZED)

        except Utilisateur.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)


class UtilisateurUpdateView(APIView):
    def patch(self, request, pk, *args, **kwargs):
        try:
            utilisateur = Utilisateur.objects.get(pk=pk)
            utilisateur.statut = request.data.get('statut', utilisateur.statut)
            utilisateur.save()
            return Response(UtilisateurSerializer(utilisateur).data, status=status.HTTP_200_OK)
        except Utilisateur.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)



