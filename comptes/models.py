from django.db import models

class TypeComptes(models.Model):
    id_type_compte = models.AutoField(primary_key=True)
    type_compte = models.CharField(max_length=100)

    def __str__(self):
        return self.type_compte

class Comptes(models.Model):
    id_compte = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20)
    libelle = models.CharField(max_length=2000)
    
    # La clé étrangère avec un indent correct
    id_type_compte = models.ForeignKey('typeComptes.TypeComptes', on_delete=models.CASCADE, db_column='id_type_compte')

    def __str__(self):
        return self.libelle

    class Meta:
        db_table = 'comptes'
