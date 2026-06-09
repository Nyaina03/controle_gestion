from django.db import models

class Articles(models.Model):
    id_article = models.AutoField(primary_key = True)
    code_famille = models.IntegerField()
    famille_article = models.CharField(max_length=200)
    id_compte = models.ForeignKey('comptes.Comptes', on_delete=models.CASCADE, db_column='id_compte')

    class Meta:
        db_table = 'articles'

