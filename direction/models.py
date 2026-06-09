from django.db import models

class Direction(models.Model):
    id_direction = models.AutoField(primary_key=True)
    nom_direction = models.CharField(max_length=100)

    def __str__(self):
        return self.nom_direction

    class Meta:
        db_table = 'direction'

