from django.db import models

class Stat(models.Model):
    id_stat = models.AutoField(primary_key=True)
    libelle_stat = models.CharField(max_length=100)
    code_stat = models.CharField(max_length=100)

    class Meta:
        db_table = 'stat'

class Marchandises(models.Model):
    id_marchandise = models.AutoField(primary_key=True)
    importation_donnees = models.CharField(max_length=200)
    port_ou_localite = models.ForeignKey(
        'localites.Ville',
        on_delete=models.CASCADE,
        db_column='port_ou_localite',
        related_name='marchandises_port_ou_localite'  # Ajout de related_name pour la relation inverse
    )
    date_operation = models.DateField()
    type_operation = models.CharField(max_length=200)
    id_navire = models.ForeignKey(
        'NavireOperationnels',  # Assurez-vous que le modèle 'NaviresOperationnels' existe
        on_delete=models.CASCADE,
        db_column='id_navire'
    )
    provenance_ou_destination = models.ForeignKey(
        'localites.Ville',
        on_delete=models.CASCADE,
        db_column='provenance_ou_destination',
        related_name='marchandises_provenance_ou_destination'  # Ajout de related_name pour la relation inverse
    )
    type_stat = models.CharField(max_length=50)  # Longueur réduite à 50 comme dans la base de données
    quantite = models.IntegerField()
    code_stat = models.ForeignKey(
        'Stat',
        on_delete=models.CASCADE,
        db_column='code_stat'
    )

    class Meta:
        db_table = 'marchandises'



class NavireOperationnels(models.Model):
    id_navire = models.AutoField(primary_key=True)
    id_ville = models.ForeignKey('localites.Ville',on_delete=models.CASCADE,db_column='id_ville', null=True, blank=True)
    date_operation = models.DateField()
    navire = models.CharField(max_length=100)
    imm = models.CharField(max_length=100)

    class Meta:
        db_table = 'navires_operationnels'
