from django.db import models

class Dos(models.Model):
    id_dos = models.AutoField(primary_key=True)
    libelle = models.CharField(max_length=100)
    ref_dos = models.CharField(max_length=100) 

    class Meta:
        db_table = 'dos'