from django.db import models
from articles.models import Articles 
from direction.models import Direction
from budget.models import Budget
from comptes.models import Comptes
from creationArticle.models import CreationArticle

class BesoinParService(models.Model):
    id_besoin_par_service = models.AutoField(primary_key=True)  # Champ pour la clé primaire
    annee_besoin = models.IntegerField(null=True, blank=True)  # Champ année
    id_demandeur = models.ForeignKey(
        Direction,  # Modèle cible
        on_delete=models.CASCADE,  # Suppression en cascade
        db_column='id_demandeur'  # Nom de la colonne dans la base de données
    )
    id_creation_article = models.ForeignKey(
        CreationArticle,  # Modèle cible
        on_delete=models.CASCADE,  # Suppression en cascade
        db_column='id_creation_article'  # Nom de la colonne dans la base de données
    )
    quantite = models.IntegerField(null=True, blank=True)  # Quantité

    class Meta:
        db_table = 'besoin_par_service'  # Nom explicite de la table dans la base de données


class ModificationSuppressionBudget(models.Model):
    id_modification = models.AutoField(primary_key=True) 
    annee_modification = models.IntegerField()
    id_compte = models.ForeignKey('comptes.Comptes', on_delete=models.CASCADE, db_column='id_compte')
    id_budget = models.ForeignKey('budget.Budget', on_delete=models.CASCADE, db_column='id_budget')
    num_marche = models.CharField(max_length=100, db_column='num_marche')
    responsable = models.CharField(max_length=200, db_column='responsable')
    taux_amortissement = models.IntegerField(db_column='taux_amortissement')
    avance = models.DecimalField(max_digits=15, decimal_places=3, db_column='avance')
    remb_garantie = models.DecimalField(max_digits=15, decimal_places=3, db_column='remb_garantie')
    
    # Attachments, all nullable
    attach1 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach2 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach3 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach4 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach5 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach6 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach7 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach8 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach9 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach10 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach11 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach12 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach13 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach14 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach15 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach16 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach17 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach18 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach19 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    attach20 = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)

    def __str__(self):
        return f"Modification {self.id_modification} for {self.num_marche}"

    class Meta:
        db_table = 'modification_suppression_budget'


class AmenagementBudget(models.Model):
    id_amenagement = models.AutoField(primary_key=True)
    annee = models.IntegerField(db_column = 'annee')
    id_compte = models.ForeignKey('comptes.Comptes', on_delete=models.CASCADE, db_column = 'id_compte')
    id_budget = models.ForeignKey('budget.Budget', on_delete=models.CASCADE, db_column='id_budget')
    modif_plus = models.DecimalField(max_digits=15, decimal_places=3, db_column = 'modif_plus')
    modif_moins = models.DecimalField(max_digits=15, decimal_places=3, db_column = 'modif_moins')
    date_programme_emploi = models.DateField(db_column = 'date_programme_emploi')

    def __str__(self):
        return f"AmenagementBudget {self.id_amenagement} - {self.annee}"

    class Meta:
        db_table = 'amenagement_budget'

