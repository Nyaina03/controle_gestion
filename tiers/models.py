from django.db import models

class Tiers(models.Model):
    id_tiers = models.CharField(max_length=20, primary_key=True) 
    nom = models.CharField(max_length=100)
    prenoms = models.CharField(max_length=100)
    contact = models.CharField(max_length=100)
    raison_social = models.CharField(max_length=100, null=True, blank=True)
    num_stat = models.CharField(max_length=50, null=True, blank=True)
    nif = models.CharField(max_length=50, null=True, blank=True)
    cin = models.CharField(max_length=50, null=True, blank=True)
    id_type_tiers = models.ForeignKey(
        'typeDeTiers.TypeDeTiers',
        on_delete=models.CASCADE,
        db_column='id_type_tiers'  # Assurez-vous d'utiliser le même nom que dans la base de données
    )
    id_ville = models.ForeignKey(
        'localites.Ville',
        on_delete=models.CASCADE,
        db_column='id_ville'
    )

    class Meta:
        db_table = 'tiers'

    def __str__(self):
        return f"{self.nom} {self.prenoms}"

    @property
    def code_tiers(self):
        # Logique pour générer ou récupérer le code_tiers, par exemple :
        return f"CODE-{self.id_tiers}"  # Exemple de logique
