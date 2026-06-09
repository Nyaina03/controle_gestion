from django.shortcuts import render
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Marchandises
from .models import Stat
from .models import NavireOperationnels
from rest_framework.views import APIView
from .serializers import MarchandiseSerializer
from .serializers import NavireSerializer
from .serializers import StatSerializer
from django.db.models.functions import ExtractYear, ExtractMonth
from django.db.models import Count, F
from .serializers import EvolutionStatSerializer
from .serializers import MarchandiseEvoSerializer
from django.db.models import Q
from datetime import date
from django.db.models import Sum, Case, When, Value, IntegerField, F, DecimalField
from datetime import datetime
from .serializers import MarchandiseEvoSerializer
from django.db.models import Count, Value as V
from localites.models import Ville
from recetteApmfVas.models import RecetteApmfVas





class MarchandiseListView(APIView):
    def get(self, request):
        marchandises = Marchandises.objects.all()  # On récupère toutes les marchandises
        serializer = MarchandiseSerializer(marchandises, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("Données reçues:", request.data)  # Affiche les données reçues pour le débogage

        # Conversion des données
        try:
            request.data['quantite'] = int(request.data.get('quantite', 0))  # S'assurer que 'quantite' est un entier
            request.data['date_operation'] = request.data.get('date_operation', '').strip()  # Optionnel: Vérifier le format de la date
            request.data['id_navire'] = int(request.data.get('navire', 0))  # Assurer que 'id_navire' est un entier

            # On peut aussi faire des vérifications sur d'autres champs si nécessaire

        except ValueError as e:
            return Response({"error": "Données invalides"}, status=status.HTTP_400_BAD_REQUEST)

        # Sérialisation des données envoyées
        serializer = MarchandiseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Sauvegarde l'objet Marchandise
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Retourne les données de la nouvelle marchandise

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Retourne les erreurs si invalides


class StatListView(APIView):
    def get(self, request):
        stat = Stat.objects.all()  # On récupère toutes les marchandises
        serializer = StatSerializer(stat, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("Données reçues:", request.data)  # Affiche les données reçues pour le débogage

        # Sérialisation des données envoyées
        serializer = StatSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Sauvegarde l'objet Marchandise
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Retourne les données de la nouvelle marchandise

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Retourne les erreurs si invalides


class NavireListView(APIView):
    def get(self, request):
        try:
            # Récupérer tous les navires opérationnels
            navires = NavireOperationnels.objects.select_related('id_ville').all()
            serializer = NavireSerializer(navires, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print("Erreur lors de la récupération des données :", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            print("Données reçues par POST:", request.data)
            serializer = NavireSerializer(data=request.data)
            if serializer.is_valid():
                print("Données valides :", serializer.validated_data)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            print("Erreurs du serializer :", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Erreur pendant le traitement :", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EscalesParMoisView(APIView):
    def get(self, request):
        try:
            # Récupération de l'année via les paramètres de la requête
            year = request.query_params.get('year')
            if not year:
                return Response({"error": "L'année est requise."}, status=status.HTTP_400_BAD_REQUEST)

            # Agrégation des escales par mois et par navire pour une année donnée
            escales = (
                NavireOperationnels.objects
                .filter(date_operation__year=year)
                .annotate(
                    month=ExtractMonth('date_operation'),
                    navire_name=F('navire')
                )
                .values('month', 'navire_name')
                .annotate(total_escales=Count('id_navire'))
                .order_by('month', 'navire_name')
            )
            return Response(list(escales), status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EvolutionStatView(APIView):
    def get(self, request, *args, **kwargs):
        # Récupérer l'année de début dans la requête GET
        annee_debut = request.query_params.get('annee_debut', None)
        
        if annee_debut is None or not annee_debut.isdigit():
            return Response({"error": "L'année de début est manquante ou invalide"}, status=status.HTTP_400_BAD_REQUEST)
        
        annee_debut = int(annee_debut)
        
        # Calculer la plage des 5 années à partir de l'année de début
        annee_range = [annee_debut + i for i in range(5)]
        statistiques = []

        for annee in annee_range:
            # Utilisez select_related pour précharger les relations
            marchandises = Marchandises.objects.filter(
                date_operation__year=annee
            ).select_related(
                'port_ou_localite', 'provenance_ou_destination', 'code_stat'
            )

            # Sérialiser les résultats pour chaque année
            serialized_data = MarchandiseEvoSerializer(marchandises, many=True)
            statistiques.append({
                'annee': annee,
                'data': serialized_data.data
            })

        # Renvoi des statistiques sous la forme d'une réponse JSON
        return Response(EvolutionStatSerializer({
            'annees': annee_range, 
            'statistiques': statistiques
        }).data)


class EvoStatSur5(APIView):
    def get(self, request):
        annee_debut = request.query_params.get('annee_debut')

        if not annee_debut or not annee_debut.isdigit():
            return Response(
                {"error": "L'année de début est invalide ou manquante."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            annee_debut = int(annee_debut)
            annees = [annee_debut + i for i in range(5)]

            # Récupérer les données de la table `stat` (la table de référence pour les code_stat)
            stats = Stat.objects.all()

            # Préparer les résultats
            result = []
            for stat in stats:
                code_stat = stat.code_stat
                libelle_stat = stat.libelle_stat

                # Calculer les quantités pour chaque année
                quantites = [
                    Marchandises.objects.filter(
                        code_stat=stat,  # Utiliser l'objet Stat ici
                        date_operation__year=annee
                    ).aggregate(
                        total=Sum('quantite')
                    )['total'] or 0
                    for annee in annees
                ]

                # Ajouter les données au résultat
                result.append({
                    "code_stat": code_stat,
                    "libelle_stat": libelle_stat,
                    "quantites": quantites
                })

            return Response(
                {"annees": annees, "data": result},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )



class StatistiquesParVille(APIView):
    def get(self, request):
        # Récupérer les paramètres de la requête
        annee_debut = request.query_params.get('annee_debut')
        id_ville = request.query_params.get('id_ville')

        if not annee_debut or not annee_debut.isdigit():
            return Response(
                {"error": "L'année de début est invalide ou manquante."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not id_ville or not id_ville.isdigit():
            return Response(
                {"error": "L'ID de la ville est invalide ou manquant."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            annee_debut = int(annee_debut)
            id_ville = int(id_ville)
            annees = [annee_debut + i for i in range(5)]

            # Récupérer les données de la table `stat` (la table de référence pour les code_stat)
            stats = Stat.objects.all()

            # Préparer les résultats
            result = []
            for stat in stats:
                code_stat = stat.code_stat
                libelle_stat = stat.libelle_stat

                # Calculer les quantités pour chaque année, en filtrant par id_ville et année
                quantites = [
                    Marchandises.objects.filter(
                        code_stat=stat,  # Utiliser l'objet Stat ici
                        port_ou_localite=id_ville,  # Filtrer par l'ID de la ville
                        date_operation__year=annee
                    ).aggregate(
                        total=Sum('quantite')
                    )['total'] or 0
                    for annee in annees
                ]

                # Ajouter les données au résultat
                result.append({
                    "code_stat": code_stat,
                    "libelle_stat": libelle_stat,
                    "quantites": quantites
                })

            return Response(
                {"annees": annees, "data": result},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )




class EvoStatMensuelleParVille(APIView):

    def get(self, request):
        annee_debut = request.query_params.get('annee_debut')
        id_ville = request.query_params.get('id_ville')

        if not annee_debut or not id_ville:
            return Response({"error": "Année de début et ID de ville sont requis."}, status=400)

        # Filtrer les marchandises pour l'année et la ville spécifiées
        marchandises = Marchandises.objects.filter(
            port_ou_localite=id_ville,
            date_operation__year=annee_debut
        )

        # Initialiser un dictionnaire pour stocker les mois et les quantités
        mois_data = {month: 0 for month in range(1, 13)}  # Mois de 1 à 12, initialisés à 0

        # Parcourir les marchandises pour remplir les données mensuelles
        for marchandise in marchandises:
            mois = marchandise.date_operation.month
            mois_data[mois] += marchandise.quantite

        # Sérialiser les marchandises
        serializer = MarchandiseEvoSerializer(marchandises, many=True)

        # Formater la réponse avec les statistiques mensuelles
        response_data = [
            {
                "code_stat": marchandise['code_stat'],
                "libelle_stat": marchandise['type_stat'],
                "mois_data": [
                    mois_data[month] for month in range(1, 13)
                ]
            }
            for marchandise in serializer.data
        ]

        return Response(response_data)



class StatistiqueGlobaleFacturee(APIView):
    def get(self, request):
        # Récupérer l'année de début à partir des paramètres de la requête
        annee_debut = request.query_params.get('annee_debut')

        # Vérifier que l'année de début est fournie
        if not annee_debut:
            return Response({"error": "L'année de début est requise."}, status=400)

        try:
            # Filtrer les marchandises pour l'année spécifiée
            marchandises = Marchandises.objects.filter(
                date_operation__year=annee_debut
            )

            # Initialiser un dictionnaire pour stocker les mois et les quantités
            mois_data = {month: 0 for month in range(1, 13)}  # Mois de 1 à 12, initialisés à 0

            # Parcourir les marchandises pour remplir les données mensuelles
            for marchandise in marchandises:
                mois = marchandise.date_operation.month
                mois_data[mois] += marchandise.quantite

            # Sérialiser les marchandises
            serializer = MarchandiseEvoSerializer(marchandises, many=True)

            # Formater la réponse avec les statistiques mensuelles
            response_data = [
                {
                    "code_stat": marchandise['code_stat'],
                    "libelle_stat": marchandise['type_stat'],
                    "mois_data": [
                        mois_data[month] for month in range(1, 13)
                    ]
                }
                for marchandise in serializer.data
            ]

            return Response(response_data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)





class NaviresOperationnels(APIView):
    def get(self, request, *args, **kwargs):
        # Récupération des paramètres d'URL
        annee = request.query_params.get('annee')
        id_ville = request.query_params.get('id_ville')

        # Validation des paramètres
        if not annee or not id_ville:
            return Response(
                {"error": "Les paramètres 'annee' et 'id_ville' sont requis."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Filtrer les données
            navires = NavireOperationnels.objects.filter(
                date_operation__year=annee,
                id_ville=id_ville
            ).values(
                'id_ville', 'navire'
            ).annotate(nombre_escales=Count('id_navire'))

            # Ajouter le nom de la ville
            for navire in navires:
                ville = Ville.objects.get(id_ville=navire['id_ville'])
                navire['nom_ville'] = ville.nom_ville

            # Formater la réponse
            data = [
                {
                    "id_ville": navire['id_ville'],
                    "nom_ville": navire['nom_ville'],
                    "navire": navire['navire'],
                    "nombre_escales": navire['nombre_escales']
                }
                for navire in navires
            ]

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"Erreur lors de la récupération des données: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class MsesTransportees(APIView):
    def get(self, request):
        # Récupérer les paramètres de la requête
        annee = request.query_params.get('annee')
        id_ville = request.query_params.get('id_ville')
        type_stat = request.query_params.get('type_stat')

        if not annee or not id_ville or not type_stat:
            return Response({"error": "Les paramètres annee, id_ville et type_stat sont requis."}, status=400)

        # Filtrer les marchandises en fonction des paramètres
        marchandises = Marchandises.objects.filter(
            date_operation__year=annee,  # Filtrer par année
            type_stat=type_stat,  # Filtrer par type_stat
        ).filter(
            Q(port_ou_localite=id_ville) | Q(provenance_ou_destination=id_ville)  # Filtrer si l'une des deux correspond à id_ville
        )


        # Préparer la réponse
        data = []
        for marchandise in marchandises:
            # Récupérer le nom du navire via la relation avec la table navires_operationnels
            navire = marchandise.id_navire.navire if marchandise.id_navire else None
            
            # Récupérer un attribut du Stat plutôt que l'objet complet
            code_stat = marchandise.code_stat.code_stat if marchandise.code_stat else None  # Assurez-vous que `nom` est un champ de Stat

            data.append({
                "date_operation": marchandise.date_operation,
                "type_operation": marchandise.type_operation,
                "navire": navire,  # Utiliser la relation pour obtenir le nom du navire
                "provenance_destination": f"{marchandise.port_ou_localite.nom_ville} - {marchandise.provenance_ou_destination.nom_ville}",
                "quantite": marchandise.quantite,
                "code_stat": code_stat,  # Renvoie le nom ou un autre champ de l'objet Stat
            })

        return Response(data)





class Passagers(APIView):
    def get(self, request):
        # Récupérer les paramètres de la requête
        annee = request.query_params.get('annee')
        id_ville = request.query_params.get('id_ville')
        type_stat = request.query_params.get('type_stat')

        if not annee or not id_ville or not type_stat:
            return Response({"error": "Les paramètres annee, id_ville et type_stat sont requis."}, status=400)

        # Filtrer les marchandises en fonction des paramètres
        marchandises = Marchandises.objects.filter(
            date_operation__year=annee,  # Filtrer par année
            type_stat=type_stat,  # Filtrer par type_stat
        ).filter(
            Q(port_ou_localite=id_ville) | Q(provenance_ou_destination=id_ville)  # Filtrer si l'une des deux correspond à id_ville
        )


        # Préparer la réponse
        data = []
        for marchandise in marchandises:
            # Récupérer le nom du navire via la relation avec la table navires_operationnels
            navire = marchandise.id_navire.navire if marchandise.id_navire else None
            
            # Récupérer un attribut du Stat plutôt que l'objet complet
            code_stat = marchandise.code_stat.code_stat if marchandise.code_stat else None  # Assurez-vous que `nom` est un champ de Stat

            data.append({
                "date_operation": marchandise.date_operation,
                "type_operation": marchandise.type_operation,
                "navire": navire,  # Utiliser la relation pour obtenir le nom du navire
                "provenance_destination": f"{marchandise.port_ou_localite.nom_ville} - {marchandise.provenance_ou_destination.nom_ville}",
                "quantite": marchandise.quantite,
                "code_stat": code_stat,  # Renvoie le nom ou un autre champ de l'objet Stat
            })

        return Response(data)




class NaviresEcarts(APIView):
    def get(self, request, *args, **kwargs):
        # Récupération des paramètres d'URL
        navire = request.query_params.get('navire')  # Nom du navire
        annee = request.query_params.get('annee')  # Année

        # Validation des paramètres
        if not navire or not annee:
            return Response(
                {"error": "Les paramètres 'navire' et 'annee' sont requis."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Filtrer les données par navire et année (en extrayant l'année de date_operation)
            navires = NavireOperationnels.objects.filter(
                navire=navire,
                date_operation__year=annee  # Filtrer par l'année de date_operation
            ).values(
                'id_ville', 'navire', 'date_operation'  # Ajouter 'date_operation' aux valeurs sélectionnées
            ).annotate(nombre_escales=Count('id_navire'))

            # Ajouter le nom de la ville
            for navire_data in navires:
                ville = Ville.objects.get(id_ville=navire_data['id_ville'])
                navire_data['nom_ville'] = ville.nom_ville

            # Formater la réponse
            data = [
                {
                    "id_ville": navire_data['id_ville'],
                    "nom_ville": navire_data['nom_ville'],
                    "navire": navire_data['navire'],
                    "nombre_escales": navire_data['nombre_escales'],
                    "date_operation": navire_data['date_operation']  # Ajouter la date_operation
                }
                for navire_data in navires
            ]

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"Erreur lors de la récupération des données: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )





class GestionMarchandise(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Paramètres de filtre
            annee = request.query_params.get('annee')  # Ex: "2024"
            id_compte = request.query_params.get('id_compte')  # Ex: 1
            code_stat = request.query_params.get('code_stat')  # Ex: "STAT001"
            type_stat = request.query_params.get('type_stat')  # Ex: "Chargement"

            # Validation des paramètres
            if not all([annee, id_compte, code_stat, type_stat]):
                return Response(
                    {"error": "Tous les paramètres (annee, id_compte, code_stat, type_stat) sont requis."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Filtrer les données et joindre les tables
            results = RecetteApmfVas.objects.filter(
                id_compte=id_compte,
                date_facture__year=annee
            ).annotate(
                date_operation=F('date_facture'),
                type_operation=V(type_stat),  # Injecte directement le type stat
                navire_name=F('imm'),  # Utilise le champ 'imm' pour représenter le navire
                provenance_destination=F('id_ville'),
                nom_ville_provenance=F('id_ville__nom_ville'),  # Renommé pour éviter le conflit
                port_ou_localite=F('id_ville'),
                nom_ville_localite=F('id_ville__nom_ville'),  # Renommé pour éviter le conflit
                code_stat=V(code_stat),  # Injecte le code stat directement
                quantite_transp=Sum('montant_ht', output_field=DecimalField()),  # Quantité transportée
                quantite_facturee=Sum('montant_ttc', output_field=DecimalField()),  # Quantité facturée
                num_facture_annote=F('num_facture'),  # Renomme l'annotation
                # Calcul de l'écart entre montant_ht et montant_ttc
                ecart=(
                    Sum('montant_ht', output_field=DecimalField()) - 
                    Sum('montant_ttc', output_field=DecimalField())
                )
            ).values(
                'date_operation', 'type_operation', 'navire_name', 
                'provenance_destination', 'nom_ville_provenance', 'port_ou_localite', 
                'nom_ville_localite', 'code_stat', 'quantite_transp', 
                'quantite_facturee', 'num_facture_annote', 'ecart'
            )

            # Structurer les données pour la réponse
            data = []
            for result in results:
                data.append({
                    "date_operation": result.get('date_operation'),
                    "type_operation": result.get('type_operation'),
                    "navire_name": result.get('navire_name'),
                    "provenance_destination": result.get('provenance_destination'),
                    "nom_ville_provenance": result.get('nom_ville_provenance'),  # Ajout du nom de la ville de provenance
                    "port_ou_localite": result.get('port_ou_localite'),
                    "nom_ville_localite": result.get('nom_ville_localite'),  # Ajout du nom de la ville localité
                    "code_stat": result.get('code_stat'),
                    "quantite_transp": result.get('quantite_transp') or 0,  # Remplace None par 0
                    "quantite_facturee": result.get('quantite_facturee') or 0,  # Remplace None par 0
                    "num_facture_annote": result.get('num_facture_annote'),
                    "ecart": result.get('ecart') or 0  # Remplace None par 0
                })

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Erreur lors de la récupération des données : {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class GestionMarchandiseGlobale(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Paramètre de filtre
            annee = request.query_params.get('annee')  # Ex: "2024"

            # Validation du paramètre
            if not annee:
                return Response(
                    {"error": "Le paramètre 'annee' est requis."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Filtrer les données pour l'année donnée
            results = RecetteApmfVas.objects.filter(
                date_facture__year=annee
            ).annotate(
                date_operation=F('date_facture'),
                navire_name=F('imm'),  # Utilise le champ 'imm' pour représenter le navire
                provenance_destination=F('id_ville'),
                nom_ville_provenance=F('id_ville__nom_ville'),
                port_ou_localite=F('id_ville'),
                nom_ville_localite=F('id_ville__nom_ville'),
                quantite_transp=Sum('montant_ht', output_field=DecimalField()),
                quantite_facturee=Sum('montant_ttc', output_field=DecimalField()),
                num_facture_annote=F('num_facture'),
                ecart=(
                    Sum('montant_ht', output_field=DecimalField()) - 
                    Sum('montant_ttc', output_field=DecimalField())
                )
            ).values(
                'date_operation', 'navire_name', 
                'provenance_destination', 'nom_ville_provenance', 'port_ou_localite', 
                'nom_ville_localite', 'quantite_transp', 
                'quantite_facturee', 'num_facture_annote', 'ecart'
            )

            # Structurer les données pour la réponse
            data = []
            for result in results:
                data.append({
                    "date_operation": result.get('date_operation'),
                    "navire_name": result.get('navire_name'),
                    "provenance_destination": result.get('provenance_destination'),
                    "nom_ville_provenance": result.get('nom_ville_provenance'),
                    "port_ou_localite": result.get('port_ou_localite'),
                    "nom_ville_localite": result.get('nom_ville_localite'),
                    "quantite_transp": result.get('quantite_transp') or 0,
                    "quantite_facturee": result.get('quantite_facturee') or 0,
                    "num_facture_annote": result.get('num_facture_annote'),
                    "ecart": result.get('ecart') or 0
                })

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Erreur lors de la récupération des données : {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GestionPassagers(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Paramètres de filtre
            id_compte = request.query_params.get('id_compte')  # Ex: 1
            code_stat = request.query_params.get('code_stat')  # Ex: "STAT001"
            type_stat = request.query_params.get('type_stat')  # Ex: "Chargement"

            # Validation des paramètres
            if not all([id_compte, code_stat, type_stat]):
                return Response(
                    {"error": "Tous les paramètres (id_compte, code_stat, type_stat) sont requis."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Filtrer les données et joindre les tables
            results = RecetteApmfVas.objects.filter(
                id_compte=id_compte,
          
            ).annotate(
                date_operation=F('date_facture'),
                type_operation=V(type_stat),  # Injecte directement le type stat
                navire_name=F('imm'),  # Utilise le champ 'imm' pour représenter le navire
                provenance_destination=F('id_ville'),
                nom_ville_provenance=F('id_ville__nom_ville'),  # Renommé pour éviter le conflit
                port_ou_localite=F('id_ville'),
                nom_ville_localite=F('id_ville__nom_ville'),  # Renommé pour éviter le conflit
                code_stat=V(code_stat),  # Injecte le code stat directement
                quantite_transp=Sum('montant_ht', output_field=DecimalField()),  # Quantité transportée
                quantite_facturee=Sum('montant_ttc', output_field=DecimalField()),  # Quantité facturée
                num_facture_annote=F('num_facture'),  # Renomme l'annotation
                # Calcul de l'écart entre montant_ht et montant_ttc
                ecart=(
                    Sum('montant_ht', output_field=DecimalField()) - 
                    Sum('montant_ttc', output_field=DecimalField())
                )
            ).values(
                'date_operation', 'type_operation', 'navire_name', 
                'provenance_destination', 'nom_ville_provenance', 'port_ou_localite', 
                'nom_ville_localite', 'code_stat', 'quantite_transp', 
                'quantite_facturee', 'num_facture_annote', 'ecart'
            )

            # Structurer les données pour la réponse
            data = []
            for result in results:
                data.append({
                    "date_operation": result.get('date_operation'),
                    "type_operation": result.get('type_operation'),
                    "navire_name": result.get('navire_name'),
                    "provenance_destination": result.get('provenance_destination'),
                    "nom_ville_provenance": result.get('nom_ville_provenance'),  # Ajout du nom de la ville de provenance
                    "port_ou_localite": result.get('port_ou_localite'),
                    "nom_ville_localite": result.get('nom_ville_localite'),  # Ajout du nom de la ville localité
                    "code_stat": result.get('code_stat'),
                    "quantite_transp": result.get('quantite_transp') or 0,  # Remplace None par 0
                    "quantite_facturee": result.get('quantite_facturee') or 0,  # Remplace None par 0
                    "num_facture_annote": result.get('num_facture_annote'),
                    "ecart": result.get('ecart') or 0  # Remplace None par 0
                })

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Erreur lors de la récupération des données : {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
