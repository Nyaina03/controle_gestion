from django.db import models

class Budget(models.Model):
    id_budget = models.AutoField(primary_key=True)
    annee = models.IntegerField()  
    code_programme = models.IntegerField()  
    id_compte = models.ForeignKey('comptes.Comptes', on_delete=models.CASCADE, db_column='id_compte')
    montant = models.DecimalField(max_digits=15, decimal_places=2)  
    libelle = models.CharField(max_length=2000) 
    id_ville = models.ForeignKey('localites.Ville', on_delete=models.CASCADE, db_column='id_ville')  

    def __str__(self):
        return f"{self.libelle} - {self.montant}"  

    class Meta:
        db_table = 'budget'
