from django.db import models

from django.db import models

class CreationArticle(models.Model):
    id_creation_article = models.AutoField(primary_key=True)
    code_famille = models.IntegerField(null=True, blank=True)
    code_article = models.CharField(max_length=50, null=True, blank=True)
    article = models.CharField(max_length=100, null=True, blank=True)
    pu = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    quantite = models. IntegerField(null=True, blank=True)

    def __str__(self):
        return self.article

    class Meta:
        db_table = 'creation_article'
