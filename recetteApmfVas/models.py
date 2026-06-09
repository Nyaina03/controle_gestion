from django.db import models
from comptes.models import Comptes  
from localites.models import Ville
from tiers.models import Tiers

class RecetteApmfVas(models.Model):
	id_recette_apmf_vas = models.AutoField(primary_key=True)
	id_compte = models.ForeignKey(Comptes, on_delete=models.CASCADE, db_column='id_compte')
	id_ville = models.ForeignKey(Ville, on_delete=models.CASCADE, db_column='id_ville')
	id_tiers = models.ForeignKey(Tiers, on_delete=models.CASCADE, db_column='id_tiers')
	taux_tva = models.IntegerField()
	navire = models.CharField(max_length=200)
	imm = models.CharField(max_length=200)
	num_facture = models.CharField(max_length=100)
	libelle = models.CharField(max_length=2000)
	date_facture = models.DateField()
	montant_ht = models.DecimalField(max_digits=15, decimal_places=2) 
	tva = models.DecimalField(max_digits=15, decimal_places=2) 
	montant_ttc = models.DecimalField(max_digits=15, decimal_places=2) 


	class Meta:
		db_table = 'recette_apmf_vas'



