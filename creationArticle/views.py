from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CreationArticle
from .serializers import CreationArticleSerializer
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import F, Sum
from .models import CreationArticle
from elaborationBudget.models import BesoinParService
from articles.models import Articles
from comptes.models import Comptes
from direction.models import Direction

class CreationArticleView(APIView):
    def get(self, request):
        articles = CreationArticle.objects.all()
        serializer = CreationArticleSerializer(articles, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreationArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreationArticleDetailView(APIView):
    def get(self, request, pk):
        article = get_object_or_404(CreationArticle, pk=pk)
        serializer = CreationArticleSerializer(article)
        return Response(serializer.data)

    def put(self, request, pk):
        article = get_object_or_404(CreationArticle, pk=pk)
        serializer = CreationArticleSerializer(article, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        article = get_object_or_404(CreationArticle, pk=pk)
        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




class EtatBesoinParService(APIView):
    def get(self, request, annee, direction):
        """
        Récupère les besoins par service filtrés selon l'année et la direction.
        """
        print(f"Année: {annee}, Direction: {direction}")  # Log des paramètres

        try:
            # Filtrage sur l'année et la direction
            besoins = (
                BesoinParService.objects
                .filter(annee_besoin=annee, id_demandeur=direction)
                .select_related('id_creation_article')
                .annotate(
                    code_article=F('id_creation_article__code_article'),
                    article=F('id_creation_article__article'),
                    pu=F('id_creation_article__pu'),
                    montant=F('quantite') * F('id_creation_article__pu')
                )
                .values('code_article', 'article', 'quantite', 'pu', 'montant')
            )

            # Si aucun besoin n'est trouvé
            if not besoins.exists():
                return Response({"error": "Aucun besoin trouvé pour cette année et direction."}, status=status.HTTP_404_NOT_FOUND)

            resultats = list(besoins)
            # Avant de retourner la réponse
            print(besoins)
            return Response(resultats, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EtatParFamille(APIView):
    def get(self, request, annee, code_famille):
        """
        Récupère les besoins par famille filtrés selon l'année et le code_famille.
        """
        print(f"Année: {annee}, Code Famille: {code_famille}")  # Log des paramètres

        try:
            # Filtrage sur l'année et le code_famille
            besoins = (
                BesoinParService.objects
                .filter(annee_besoin=annee)
                .select_related('id_creation_article')
                .filter(id_creation_article__code_famille=code_famille)  # Filtrage sur le code_famille
                .annotate(
                    code_article=F('id_creation_article__code_article'),
                    article=F('id_creation_article__article'),
                    pu=F('id_creation_article__pu'),
                    montant=F('quantite') * F('id_creation_article__pu')
                )
                .values('code_article', 'article', 'quantite', 'pu', 'montant')
            )

            # Si aucun besoin n'est trouvé
            if not besoins.exists():
                return Response({"error": "Aucun besoin trouvé pour cette année et code famille."}, status=status.HTTP_404_NOT_FOUND)

            resultats = list(besoins)
            # Avant de retourner la réponse
            print(besoins)
            return Response(resultats, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class TotalParFamille(APIView):
    def get(self, request, annee):
        """
        Récupère les détails des besoins par famille filtrés selon l'année,
        retourne le montant total des articles par famille, ainsi que les détails des comptes associés.
        """
        print(f"Année: {annee}")  # Log de l'année

        try:
            # Filtrage des besoins pour l'année donnée
            total_par_famille = (
                BesoinParService.objects
                .filter(annee_besoin=annee)  # Filtrage sur l'année
                .select_related('id_creation_article')  # Relation avec creation_article
                .annotate(
                    code_famille=F('id_creation_article__code_famille'),
                    code_article=F('id_creation_article__code_article'),
                    article=F('id_creation_article__article'),
                    pu=F('id_creation_article__pu'),
                    montant=F('quantite') * F('id_creation_article__pu')  # Calcul du montant
                )
                .values(
                    'code_famille', 'code_article', 'article', 'pu', 'montant'
                )
            )

            resultats = []
            for besoin in total_par_famille:
                # Récupérer l'article correspondant via code_famille
                article = Articles.objects.filter(
                    code_famille=besoin['code_famille']
                ).first()

                if article:
                    # Récupérer uniquement l'ID du compte
                    besoin['id_compte'] = article.id_compte_id  # Utilise l'ID directement
                    compte = Comptes.objects.filter(id_compte=article.id_compte_id).first()
                    if compte:
                        besoin['code_compte'] = compte.code
                        besoin['libelle_compte'] = compte.libelle
                    else:
                        besoin['code_compte'] = None
                        besoin['libelle_compte'] = None
                else:
                    besoin['id_compte'] = None
                    besoin['code_compte'] = None
                    besoin['libelle_compte'] = None

                resultats.append(besoin)

            return Response(resultats, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EtatParFamilleParDemandeur(APIView):
    def get(self, request, direction, annee):
        """
        Récupère l'état des besoins par famille et par demandeur (direction) filtrés selon l'année,
        retourne les montants des articles par famille, ainsi que les détails des comptes associés.
        """
        print(f"Direction: {direction}, Année: {annee}")  # Log de la direction et de l'année

        try:
            # Filtrage des besoins pour l'année et direction donnés
            etat_par_famille_par_demandeur = (
                BesoinParService.objects
                .filter(annee_besoin=annee, id_demandeur=direction)  # Filtrage sur l'année et la direction
                .select_related('id_creation_article', 'id_demandeur')  # Relations avec article et demandeur (direction)
                .annotate(
                    code_famille=F('id_creation_article__code_famille'),
                    code_article=F('id_creation_article__code_article'),
                    article=F('id_creation_article__article'),
                    pu=F('id_creation_article__pu'),
                    montant=F('quantite') * F('id_creation_article__pu')  # Calcul du montant
                )
                .values(
                    'id_demandeur', 'code_famille', 'code_article', 'article', 'pu', 'montant'
                )
            )

            resultats = []
            for besoin in etat_par_famille_par_demandeur:
                # Récupérer la direction correspondante via id_demandeur
                direction_obj = Direction.objects.filter(id_direction=besoin['id_demandeur']).first()

                if direction_obj:
                    besoin['nom_direction'] = direction_obj.nom_direction
                else:
                    besoin['nom_direction'] = None

                # Récupérer l'article correspondant via code_famille
                article = Articles.objects.filter(code_famille=besoin['code_famille']).first()

                if article:
                    # Récupérer uniquement l'ID du compte
                    besoin['id_compte'] = article.id_compte_id  # Utilise l'ID directement
                    compte = Comptes.objects.filter(id_compte=article.id_compte_id).first()
                    if compte:
                        besoin['code_compte'] = compte.code
                        besoin['libelle_compte'] = compte.libelle
                    else:
                        besoin['code_compte'] = None
                        besoin['libelle_compte'] = None
                else:
                    besoin['id_compte'] = None
                    besoin['code_compte'] = None
                    besoin['libelle_compte'] = None

                resultats.append(besoin)

            return Response(resultats, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TotalParDemandeur(APIView):
    def get(self, request, annee):
        """
        Récupère le total des montants par demandeur pour une année donnée.
        """
        try:
            # Filtrage des besoins pour l'année donnée
            total_par_demandeur = (
                BesoinParService.objects
                .filter(annee_besoin=annee)  # Filtrage par année
                .select_related('id_demandeur')  # Relation avec le demandeur (direction)
                .annotate(
                    total_montant=Sum(F('quantite') * F('id_creation_article__pu'))  # Calcul du total des montants
                )
                .values('id_demandeur', 'total_montant')  # Retourner les informations par demandeur
            )

            # Récupérer les informations supplémentaires sur les directions (demandeurs)
            resultats = []
            for demandeur in total_par_demandeur:
                direction = Direction.objects.filter(id_direction=demandeur['id_demandeur']).first()
                if direction:
                    demandeur['nom_direction'] = direction.nom_direction
                else:
                    demandeur['nom_direction'] = None

                resultats.append(demandeur)

            return Response(resultats, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
