from django.db import models

class TypeOperation(models.Model):
    id_type_operation = models.AutoField(primary_key=True, db_column='id_type_operation')
    type_operation = models.CharField(max_length=100, db_column='type_operation')

    def __str__(self):
        return self.type_operation

    class Meta:
        db_table = 'type_operation'
