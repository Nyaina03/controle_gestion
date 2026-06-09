from django.db import models

class PTA(models.Model):
    id_pta = models.AutoField(primary_key=True)
    annee = models.IntegerField()  
    code_strategique = models.CharField(max_length=50)
    code_activite = models.CharField(max_length=50)
    libelle = models.CharField(max_length=100)
    montant = models.DecimalField(max_digits=15, decimal_places=2)
    id_direction = models.ForeignKey('direction.Direction', on_delete=models.CASCADE, db_column='id_direction')  
    code_programme = models.IntegerField()
    ref_dos = models.ForeignKey('dos.Dos', on_delete=models.CASCADE, db_column='ref_dos')

    class Meta:
        db_table = 'pta'

class HistoriquePTA(models.Model):
    id_pta = models.AutoField(primary_key=True)
    annee = models.IntegerField()  
    code_strategique = models.CharField(max_length=50)
    code_activite = models.CharField(max_length=50)
    libelle = models.CharField(max_length=100)
    montant = models.DecimalField(max_digits=15, decimal_places=2)
    id_direction = models.ForeignKey('direction.Direction', on_delete=models.CASCADE, db_column='id_direction')  
    code_programme = models.IntegerField()
    ref_dos = models.ForeignKey('dos.Dos', on_delete=models.CASCADE, db_column='ref_dos')
    date_misajour = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'historiques_pta'
        indexes = [
            models.Index(fields=['id_pta','date_misajour']),
        ]

