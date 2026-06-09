from django.db import models

class TypeDeTiers(models.Model):
    id_type_tiers = models.AutoField(primary_key=True) 
    type_tiers = models.CharField(max_length=255)
    
    class Meta:
        db_table = 'type_tiers' 