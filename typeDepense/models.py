from django.db import models

class TypeDepense(models.Model):
    id_type_depense = models.AutoField(primary_key=True)
    type_depense = models.CharField(max_length=100, db_column='type_depense')

    def __str__(self):
        return self.type_depense
    
    class Meta:
        db_table = 'type_depense' 