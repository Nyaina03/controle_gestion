from django.db import models


class TypeComptes(models.Model):
    id_type_compte = models.AutoField(primary_key=True)
    type_compte = models.CharField(max_length=50)

    def __str__(self):
        return self.type_compte
    
    class Meta:
        db_table = 'type_compte' 