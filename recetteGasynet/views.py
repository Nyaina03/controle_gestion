from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import RecetteGasyNet
from .serializers import RecetteGasyNetSerializer
import csv
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from rest_framework.generics import GenericAPIView, ListCreateAPIView
from rest_framework.mixins import ListModelMixin, CreateModelMixin
import datetime
from datetime import datetime

from django.db import connection
from django.http import JsonResponse
from .models import RecetteGasyNet

from django.db.models import Sum, F, Case, When, Value, IntegerField
from django.http import JsonResponse
from django.db.models.functions import ExtractYear, ExtractMonth
from django.db.models import F, Case, When, IntegerField, Sum
from django.db.models.functions import ExtractYear, ExtractMonth
from rest_framework.views import APIView
from django.http import JsonResponse
from .models import RecetteGasyNet

from django.db.models import DecimalField
from django.db.models import DecimalField, F, Sum, ExpressionWrapper

from comptes.models import Comptes
from localites.models import Ville  # Ajoutez cette ligne si ce n'est pas déjà fait
import csv
import logging
from django.db import IntegrityError


class RecetteGasyNetListView(APIView):

    def post(self, request):
        data = request.data

        # Vérification que les champs sont présents dans les données
        montant_ht = data.get('montant_ht')
        tva = data.get('tva')

        # Validation de 'montant_ht' et 'tva'
        if montant_ht is None or tva is None:
            return Response({'error': 'Montant HT et TVA sont requis'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            montant_ht = float(montant_ht)
            tva = float(tva)
        except ValueError:
            return Response({'error': 'Montant HT ou TVA invalides'}, status=status.HTTP_400_BAD_REQUEST)

        # Vérification de la validité des ids
        id_compte = data.get('id_compte')
        id_ville = data.get('id_ville')

        if not isinstance(id_compte, int) or not isinstance(id_ville, int):
            return Response({'error': 'id_compte et id_ville doivent être des entiers'}, status=status.HTTP_400_BAD_REQUEST)

        # Validation du serializer
        serializer = RecetteGasyNetSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # Récupération des paramètres GET
        annee = request.GET.get('annee')
        localite = request.GET.get('localite')
        tva = request.GET.get('tva')
        compte = request.GET.get('compte')

        # Validation des paramètres
        if not all([annee, localite, tva, compte]):
            return JsonResponse({"error": "Tous les paramètres (annee, localite, tva, compte) sont requis."}, status=400)

        # Convertir 'annee', 'localite' et 'compte' en entiers
        try:
            annee = int(annee)
            localite = int(localite)
            compte = int(compte)
        except ValueError:
            return JsonResponse({"error": "Les paramètres 'annee', 'localite' et 'compte' doivent être des entiers."}, status=400)

        # Convertir 'tva' en valeur de calcul
        if tva == 'avec':
            tva_filter = Case(
                When(tva=20, then=F('montant_ht') * 1.20),  # Calcul avec TVA (ajoute 20% à 'montant_ht')
                default=F('montant_ht'),  # Si tva != 20, on garde 'montant_ht' tel quel
                output_field=IntegerField()
            )
        elif tva == 'sans':
            tva_filter = F('montant_ht')  # Pas de TVA dans les calculs
        else:
            return JsonResponse({"error": "La valeur de 'tva' doit être 'avec' ou 'sans'."}, status=400)

        # Récupérer les recettes en fonction de l'année, la localité, et le compte
        recettes = RecetteGasyNet.objects.annotate(
            annee=ExtractYear('date_recette'),  # Extraction de l'année de la date
            mois=ExtractMonth('date_recette'),
            montant_avec_tva=tva_filter  # Annoter la somme après calcul de la TVA
        ).filter(
            annee=annee,  # Filtrer par l'année extraite
            id_ville=localite,
            id_compte=compte
        ).values('mois', 'id_ville') \
         .annotate(total_montant_ht=Sum('montant_avec_tva')) \
         .order_by('mois')

        # Créer une structure de données mensuelles avec 0 si aucun résultat
        mois_data = {
            'Janvier': 0, 'Février': 0, 'Mars': 0, 'Avril': 0, 'Mai': 0, 'Juin': 0,
            'Juillet': 0, 'Août': 0, 'Septembre': 0, 'Octobre': 0, 'Novembre': 0, 'Décembre': 0
        }

        # Remplir les données du mois correspondant
        for recette in recettes:
            mois_index = recette['mois'] - 1  # Mois dans la base de données commence à 1
            mois_names = list(mois_data.keys())  # Récupérer les noms des mois
            mois_data[mois_names[mois_index]] = recette['total_montant_ht']

        # Vérification de la présence des données pour la localité et mise à jour de la réponse
        result = {
            'localite': localite,
            'mois': mois_data,
            'total': sum(mois_data.values())
        }

        # Si le total est 0, vérifier si la localité existe réellement dans la base
        if result['total'] == 0:
            localite_data = RecetteGasyNet.objects.filter(
                id_ville=localite,
                id_compte=compte
            ).exists()
            if not localite_data:
                return JsonResponse({"error": "Aucune donnée trouvée pour la localité et les critères spécifiés."}, status=404)

        return JsonResponse(result, safe=False)



class EvolutionSur5AnsView(APIView):
    def get(self, request):
        try:
            # Récupérer les paramètres
            annee_debut = int(request.query_params.get("annee_debut"))
            tva = request.query_params.get("tva")
            id_ville = int(request.query_params.get("localite"))

            if not annee_debut or not tva or not id_ville:
                return Response(
                    {"error": "Tous les paramètres sont requis (annee_debut, tva, localite)"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Définir le filtre TVA
            if tva == "avec":
                tva_filter = ExpressionWrapper(
                    F("montant_ht") * 1.20, output_field=DecimalField()
                )
            elif tva == "sans":
                tva_filter = ExpressionWrapper(
                    F("montant_ht"), output_field=DecimalField()
                )
            else:
                return Response(
                    {"error": "La valeur de 'tva' doit être 'avec' ou 'sans'."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Filtrer les recettes pour les comptes RFM (2) et DSM (1)
            recettes = (
                RecetteGasyNet.objects.annotate(annee=ExtractYear("date_recette"))
                .filter(
                    annee__gte=annee_debut,
                    annee__lt=annee_debut + 5,
                    id_ville=id_ville,
                    id_compte__in=[1, 2],  # Filtrer les comptes RFM (2) et DSM (1)
                )
                .annotate(montant_tva=tva_filter)
                .values("annee", "id_compte")
                .annotate(total=Sum("montant_tva"))  # Totaliser par compte et année
            )

            # Initialiser les résultats avec des années et des valeurs par défaut
            result = {year: {"RFM": 0, "DSM": 0} for year in range(annee_debut, annee_debut + 5)}

            # Remplir les résultats en fonction des comptes
            for recette in recettes:
                year = recette["annee"]
                if recette["id_compte"] == 2:  # RFM
                    result[year]["RFM"] += recette["total"]
                elif recette["id_compte"] == 1:  # DSM
                    result[year]["DSM"] += recette["total"]

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RecetteGasyNetDetailView(APIView):
    def get(self, request, pk):
        try:
            recette = RecetteGasyNet.objects.get(pk=pk)
        except RecetteGasyNet.DoesNotExist:
            return Response({'error': 'Recette GasyNet non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = RecetteGasyNetSerializer(recette)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            recette = RecetteGasyNet.objects.get(pk=pk)
        except RecetteGasyNet.DoesNotExist:
            return Response({'error': 'Recette GasyNet non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RecetteGasyNetSerializer(recette, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            recette = RecetteGasyNet.objects.get(pk=pk)
        except RecetteGasyNet.DoesNotExist:
            return Response({'error': 'Recette GasyNet non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        recette.delete()
        return Response({'message': 'Recette GasyNet supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)




logger = logging.getLogger(__name__)


class RecetteGasyNetImportView(APIView):

    def convert_date(self, date_str):
        """
        Tente de convertir une chaîne de date dans différents formats possibles.
        Si le format de la date est invalide, il retourne None.
        """
        if not date_str or date_str.lower() == 'f':
            return None

        date_formats = ["%d/%m/%Y", "%Y-%m-%d", "%m/%d/%Y"]  # Formats potentiels de date
        for date_format in date_formats:
            try:
                # Nettoyage de la chaîne de date pour enlever des espaces ou caractères invisibles
                date_str = date_str.strip()

                # Conversion réussie
                parsed_date = datetime.strptime(date_str, date_format)
                # Retourner la date au format attendu par la base de données
                return parsed_date.strftime("%Y-%m-%d")
            except ValueError:
                continue
        return None  # Retourne None si aucun format valide n'a été trouvé

    def import_data(self, data):
        for row in data:
            try:
                # Vérification de la validité de la date avant la conversion
                if not row[0] or row[0].lower() == 'f':  # Exclure les lignes invalides
                    print(f"Date invalide trouvée : {row[0]}")
                    continue

                # Convertir la date
                #date_recette = self.convert_date(row[0])
                #if not date_recette:
                #    print(f"Erreur de format de date : '{row[0]}' ne correspond à aucun format attendu.")
                #    continue
                date_recette = row[0]
                code_compte = row[1]
                bureau_douane = row[2]
                nom_ville = row[3]
                montant_ht = float(row[4])
                tva = int(row[5])

                # Rechercher les relations (Comptes et Ville)
                try:
                    compte = Comptes.objects.get(code=code_compte)
                except Comptes.DoesNotExist:
                    print(f"Erreur : Compte avec code '{code_compte}' introuvable. Ligne ignorée : {row}")
                    continue

                try:
                    ville = Ville.objects.get(nom_ville=nom_ville)
                except Ville.DoesNotExist:
                    print(f"Erreur : Ville '{nom_ville}' introuvable. Ligne ignorée : {row}")
                    continue

                # Créer l'entrée dans la table
                RecetteGasynet.objects.create(
                    date_recette=date_recette,
                    id_compte=compte,
                    bureau_douane=bureau_douane,
                    id_ville=ville,
                    montant_ht=montant_ht,
                    tva=tva
                )
                print(f"Ligne importée avec succès : {row}")

            except IntegrityError as e:
                print(f"Erreur d'intégrité lors de l'importation de la ligne {row} : {e}")
            except Exception as e:
                print(f"Erreur inattendue lors de l'importation de la ligne {row} : {e}")

    def post(self, request, *args, **kwargs):
        """
        Gère les requêtes POST pour importer des données.
        """
        data = request.data

        # Si les données sont envoyées sous forme de chaîne CSV brute
        if isinstance(data, str):
            csv_reader = csv.reader(StringIO(data))
            data = [row for row in csv_reader]

        if not data:
            return JsonResponse({"error": "Aucune donnée fournie pour l'importation."}, status=400)

        # Vérifiez et affichez chaque ligne et colonne des données
        print("Données reçues pour l'importation (détail ligne par ligne) :")
        for i, row in enumerate(data):
            print(f"Ligne {i + 1} :")
            for j, column in enumerate(row):
                print(f"  Colonne {j + 1}: {column}")

        # Import des données
        self.import_data(data)

        return JsonResponse({"message": "Importation réussie."}, status=200)

    def get(self, request, *args, **kwargs):
        return JsonResponse({
            "error": "Cette route n'accepte que les requêtes POST. Utilisez une requête POST pour importer un fichier."
        }, status=405)
