from django.db import models
from comptes.models import Comptes  
from localites.models import Ville
from tiers.models import Tiers

class RecetteAllApmf(models.Model):
    id_recette_apmf_all = models.AutoField(primary_key=True) 
    id_compte = models.ForeignKey(Comptes, on_delete=models.CASCADE, db_column="id_compte")
    id_ville = models.ForeignKey(Ville, on_delete=models.CASCADE, db_column="id_ville")
    id_tiers = models.ForeignKey(Tiers, on_delete=models.CASCADE, db_column='id_tiers', to_field='id_tiers')
    taux_tva = models.DecimalField(max_digits=5, decimal_places=2)
    num_facture = models.CharField(max_length=50)
    libelle = models.CharField(max_length=255)
    date_facture = models.DateField()
    montant_ht = models.DecimalField(max_digits=10, decimal_places=2)
    tva = models.DecimalField(max_digits=10, decimal_places=2)
    montant_ttc = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'recette_all_apmf'
