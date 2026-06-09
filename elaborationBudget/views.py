from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import render
from rest_framework.response import Response
from django.http import JsonResponse
from .models import BesoinParService
from .serializers import BesoinParServiceSerializer
from .serializers import  ModificationSuppressionBudgetSerializer
from  budget.models import Budget
from  budget.models import Budget
from  budget.serializers import BudgetSerializer
from .models import AmenagementBudget
from .serializers import AmenagementBudgetSerializer
from datetime import datetime



class BesoinParServiceView(APIView):

    def get(self, request):
        besoinParService = BesoinParService.objects.all()
        serializer = BesoinParServiceSerializer(besoinParService, many=True)
        return Response(serializer.data)


    def post(self, request):
        print("Données reçues:", request.data)
        
        # Vérification et conversion de l'ID de l'article (id_article)
        id_creation_article = request.data.get('id_creation_article')
        id_demandeur = request.data.get('id_demandeur')
        annee_besoin = request.data.get('annee')  # Ajouter ce print pour vérifier la donnée
        
        print("Année reçue:", annee_besoin)  # Vérifiez que l'année est bien passée
        
        try:
            id_creation_article = int(id_creation_article)
            id_demandeur = int(id_demandeur)
        except (ValueError, TypeError):
            return Response({'error': 'id_creation_article et id_demandeur doivent être un entier'}, status=status.HTTP_400_BAD_REQUEST)

        # Mise à jour des données pour inclure l'ID converti
        request.data['id_creation_article'] = id_creation_article
        request.data['id_demandeur'] = id_demandeur
        request.data['annee_besoin'] = annee_besoin  # Ajoutez explicitement l'année ici

        serializer = BesoinParServiceSerializer(data=request.data)
        if serializer.is_valid():
            print("Données validées:", serializer.validated_data)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ModificationSuppressionView(APIView):
    def get(self, request, id_compte, annee):
        try:
            # Récupérer les lignes budgétaires correspondant au compte et à l'année choisie
            annee = int(annee)
            budgets = Budget.objects.filter(id_compte=id_compte, annee=annee)
            serializer = BudgetSerializer(budgets, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



    def post(self, request):
        print("Données reçues:", request.data)
        
        # Vérification et conversion des champs dans la requête
        try:
            # ID des références (compte et budget)
            id_compte = int(request.data.get('id_compte'))
            id_budget = int(request.data.get('id_budget'))

            # Conversion des champs numériques
            avance = float(request.data.get('avance', 0))
            remb_garantie = float(request.data.get('remb_garantie', 0))
            taux_amortissement = int(request.data.get('taux_amortissement', 0))

            # Vérification et récupération des pièces jointes
            attach_fields = ['attach1', 'attach2', 'attach3', 'attach4', 'attach5', 'attach6', 
                             'attach7', 'attach8', 'attach9', 'attach10', 'attach11', 'attach12',
                             'attach13', 'attach14', 'attach15', 'attach16', 'attach17', 'attach18',
                             'attach19', 'attach20']
            for attach in attach_fields:
                request.data[attach] = float(request.data.get(attach, 0) or 0)  # Convertir les pièces jointes en flottants, ou 0 si vide

        except (ValueError, TypeError) as e:
            return Response({'error': 'Les données doivent être au bon format, en particulier les champs numériques et les IDs.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Mise à jour des données après conversion
        request.data['id_compte'] = id_compte
        request.data['id_budget'] = id_budget
        request.data['avance'] = avance
        request.data['remb_garantie'] = remb_garantie
        request.data['taux_amortissement'] = taux_amortissement

        # Sérialisation des données
        serializer = ModificationSuppressionBudgetSerializer(data=request.data)
        
        if serializer.is_valid():
            print("Données validées:", serializer.validated_data)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class AmenagementBudgetView(APIView):
    """
    Récupérer la liste des budgets d'aménagements ou en ajouter un nouveau.
    """

    def get(self, request):
        """
        Récupérer la liste de tous les budgets d'aménagements
        """
        amenagement_budgets = AmenagementBudget.objects.all()
        serializer = AmenagementBudgetSerializer(amenagement_budgets, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Ajouter un nouveau budget d'aménagement avec validation des champs.
        """
        print("Données reçues:", request.data)

        # Renommer les champs pour correspondre aux attentes du sérialiseur
        data = {
            'annee': request.data.get('annee'),
            'id_compte': request.data.get('id_compte'),
            'id_budget': request.data.get('id_budget'),
            'modif_plus': request.data.get('modifPlus'),
            'modif_moins': request.data.get('modifMoins'),
            'date_programme_emploi': request.data.get('dateProgramme'),
        }

        # Conversion des champs si nécessaire
        try:
            data['annee'] = int(data['annee'])
            data['id_compte'] = int(data['id_compte'])
            data['id_budget'] = int(data['id_budget'])
            data['modif_plus'] = float(data['modif_plus'])
            data['modif_moins'] = float(data['modif_moins'])
            data['date_programme_emploi'] = datetime.strptime(data['date_programme_emploi'], "%Y-%m-%d").date()
        except (ValueError, TypeError) as e:
            return Response(
                {'error': 'Données invalides. Vérifiez les champs numériques ou le format de la date.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Sérialisation et validation
        serializer = AmenagementBudgetSerializer(data=data)
        if serializer.is_valid():
            print("Données validées:", serializer.validated_data)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print("Erreurs de validation:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
