from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class RecetteGasyNet(models.Model):
    id_recette_gasynet = models.AutoField(primary_key=True, db_column='id_recette_gasynet')
    date_recette = models.DateField()
    id_compte = models.ForeignKey('comptes.Comptes', on_delete=models.CASCADE, db_column='id_compte')
    bureau_douane = models.CharField(max_length=100)
    id_ville = models.ForeignKey('localites.Ville', on_delete=models.CASCADE, db_column='id_ville')
    montant_ht = models.DecimalField(max_digits=15, decimal_places=2)
    tva = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(99)])

    class Meta:
        db_table = 'recette_gasynet'

    def __str__(self):
        return f"Recette {self.id_recette_gasynet} - {self.bureau_douane}"

    def clean(self):
        super().clean()
        
        if self.montant_ht <= 0:
            raise ValidationError("Le montant HT doit être positif.")
        if self.tva < 0 or self.tva > 99:
            raise ValidationError("La TVA doit être entre 0% et 99%.")
