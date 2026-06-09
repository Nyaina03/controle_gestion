from django.db import models

class Marches(models.Model):
    id_marche = models.AutoField(primary_key=True)
    annee = models.IntegerField()
    id_compte = models.ForeignKey('comptes.Comptes', on_delete=models.CASCADE, db_column='id_compte')
    num_marche = models.CharField(max_length=50)
    id_financement = models.ForeignKey('financement.Financement', on_delete=models.CASCADE, db_column='id_financement')
    id_type_depense = models.ForeignKey('typeDepense.TypeDepense', on_delete=models.CASCADE, db_column='id_type_depense')
    objet_marche = models.CharField(max_length=200)
    attributaire = models.CharField(max_length=200)
    montant_ht = models.DecimalField(max_digits=15, decimal_places=2)     
    tva = models.IntegerField()
    num_os = models.CharField(max_length=50)
    date_os = models.DateField()
    num_sur_registre = models.CharField(max_length=50)
    delai_en_jour = models.IntegerField()
    date_signature = models.DateField()
    date_notification = models.DateField()
    observation = models.CharField(max_length=500)

    class Meta:
        db_table = 'marches'



class HistoriqueMarches(models.Model):
    id_marche = models.AutoField(primary_key=True)
    annee = models.IntegerField()
    id_compte = models.ForeignKey('comptes.Comptes', on_delete=models.CASCADE, db_column='id_compte')
    num_marche = models.CharField(max_length=50)
    id_financement = models.ForeignKey('financement.Financement', on_delete=models.CASCADE, db_column='id_financement')
    id_type_depense = models.ForeignKey('typeDepense.TypeDepense', on_delete=models.CASCADE, db_column='id_type_depense')
    objet_marche = models.CharField(max_length=200)
    attributaire = models.CharField(max_length=200)
    montant_ht = models.DecimalField(max_digits=15, decimal_places=2)     
    tva = models.IntegerField()
    num_os = models.CharField(max_length=50)
    date_os = models.DateField()
    num_sur_registre = models.CharField(max_length=50)
    delai_en_jour = models.IntegerField()
    date_signature = models.DateField()
    date_notification = models.DateField()
    observation = models.CharField(max_length=500)
    date_misajour = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'historiques_marches'
        indexes = [
            models.Index(fields=['id_marche','date_misajour']),
        ]


class AttachementParCompte(models.Model):
    id_attachement = models.AutoField(primary_key=True)
    id_marche = models.ForeignKey(Marches, on_delete=models.CASCADE, db_column='id_marche')
    annee_paiement = models.IntegerField()
    num_attachement = models.CharField(max_length=50)
    montant = models.DecimalField(max_digits=15, decimal_places=3)

    def __str__(self):
        return f"Attachement {self.num_attachement} - Marche {self.id_marche}"

    class Meta :
        db_table = 'attachement_par_compte'