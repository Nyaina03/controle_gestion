from django.db import models
from comptes.models import Comptes
from localites.models import Ville
from tiers.models import Tiers
from recetteAllApmf.models import RecetteAllApmf 
from recetteGasynet.models import  RecetteGasyNet
from django.core.validators import MinValueValidator, MaxValueValidator


class RecetteCombinee(models.Model):
    recette_gasynet = models.ForeignKey(RecetteGasyNet, on_delete=models.CASCADE, related_name='combinée_gasynet')
    recette_apmf = models.ForeignKey(RecetteAllApmf, on_delete=models.CASCADE, related_name='combinée_apmf')
    date_combinée = models.DateField()
    difference_montant = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

