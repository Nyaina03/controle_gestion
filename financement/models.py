from django.db import models

class Financement(models.Model):
    id_financement = models.AutoField(primary_key=True)
    financement = models.CharField(max_length=100, db_column='financement')

    def __str__(self):
        return self.financement
    
    class Meta:
        db_table = 'financement' 