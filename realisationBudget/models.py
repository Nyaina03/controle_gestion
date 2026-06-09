from django.db import models
from tiers.models import Tiers
from comptes.models import Comptes
from typeOperation.models import TypeOperation
from django.utils import timezone

from django.core.exceptions import ValidationError

class DepensesSIIG(models.Model):
    id_depense_siig = models.AutoField(primary_key=True)
    id_type_operation = models.ForeignKey(
        TypeOperation, on_delete=models.CASCADE, db_column='id_type_operation', to_field='id_type_operation'
    )
    annee = models.IntegerField(null=True, blank=True)
    num_engagement = models.CharField(max_length=50, null=True, blank=True)
    code_programme = models.IntegerField(null=True, blank=True)
    code_tiers = models.ForeignKey(Tiers, on_delete=models.CASCADE, db_column='code_tiers', to_field='id_tiers')
    id_compte = models.ForeignKey(Comptes, on_delete=models.CASCADE, db_column='id_compte')
    objet = models.CharField(max_length=500, null=True, blank=True)
    date_eng = models.DateField(null=True, blank=True)
    grande_rubrique = models.CharField(max_length=500, null=True, blank=True)
    montant = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    etat = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'depenses_siig'

    def clean(self):
        if not self.id_type_operation:
            raise ValidationError("Le champ 'id_type_operation' est obligatoire.")
        if not self.id_compte:
            raise ValidationError("Le champ 'id_compte' est obligatoire.")


class HistoriqueDepensesSIIG(models.Model):
    id_depense_siig = models.AutoField(primary_key=True)
    id_type_operation = models.IntegerField(null=True)
    annee = models.IntegerField(null=True)
    num_engagement = models.CharField(max_length=50, null=True)
    code_programme = models.IntegerField(null=True)
    code_tiers = models.ForeignKey(Tiers, on_delete=models.CASCADE, db_column='code_tiers', to_field='id_tiers')
    id_compte = models.IntegerField(null=True)
    objet = models.CharField(max_length=500, null=True)
    date_eng = models.DateField(null=True)
    grande_rubrique = models.CharField(max_length=500, null=True)
    montant = models.DecimalField(max_digits=15, decimal_places=3, null=True)
    etat = models.CharField(max_length=50, null=True)
    date_modification=models.DateTimeField(auto_now=True)


    class Meta:
        db_table = 'historique_depenses_siig'
        indexes = [
            models.Index(fields=['id_depense_siig']),
        ]

