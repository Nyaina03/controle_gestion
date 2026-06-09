from django.db import models

class Ville(models.Model):
    id_ville = models.AutoField(primary_key=True)  
    nom_ville = models.CharField(max_length=100)
    code_ville = models.CharField(max_length=10)
    type_ville = models.CharField(max_length=50)

    class Meta:
        db_table = 'ville' 

    def __str__(self):
        return f"{self.nom_ville} (Code: {self.code_ville}) (Type: {self.type_ville})"
