from django.db import models

class DRSN(models.Model):
    id_drsn = models.AutoField(primary_key=True)
    num_facture = models.CharField(max_length=100)
    droit_de_port = models.DecimalField(max_digits=15, decimal_places=2)  
    droit_de_stationnement = models.DecimalField(max_digits=15, decimal_places=2)  
    autres = models.DecimalField(max_digits=15, decimal_places=2)  

    class Meta:
        db_table = 'drsn'

class DSM(models.Model):
    id_dsm = models.AutoField(primary_key=True)
    num_facture = models.CharField(max_length=100)
    mses_embarquees = models.DecimalField(max_digits=15, decimal_places=2)
    mses_debarquees = models.DecimalField(max_digits=15, decimal_places=2)
    passagers_nationaux = models.DecimalField(max_digits=15, decimal_places=2)
    passagers_internationaux = models.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        db_table = 'dsm'

class DM(models.Model):
    id_dm = models.AutoField(primary_key=True)
    num_facture = models.CharField(max_length=100)
    mses_embarquees = models.DecimalField(max_digits=15, decimal_places=2)
    mses_debarquees = models.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        db_table = 'dm'

class VAS(models.Model):
    id_vas = models.AutoField(primary_key=True)
    num_facture = models.CharField(max_length=100)
    nav_plaisancier_200 = models.IntegerField()
    nav_plaisancier_300 = models.IntegerField()
    emb_trad_60 =  models.IntegerField()
    emb_trad_120 = models.IntegerField()
    vedette_mot_hb_120 = models.IntegerField()
    remorqueur_vedette_200 = models.IntegerField()
    remorqueur_vedette_300 = models.IntegerField()
    barge_chaland_inf = models.IntegerField()
    barge_chaland_sup = models.IntegerField()
    nav_de_charge_inf_200 = models.IntegerField()
    nav_de_charge_inf_1600 = models.IntegerField()
    nav_de_charge_sup_1600 = models.IntegerField()
    nav_de_peche_mot_hb_220 = models.IntegerField() 
    nav_de_peche_mot_ib_280 = models.IntegerField()
    nav_de_peche_cotiere_400 = models.IntegerField()
    nav_de_peche_au_large = models.IntegerField()

    class Meta:
        db_table = 'vas'

class AAMMarins(models.Model):
    id_aam_marin = models.AutoField(primary_key=True)
    num_facture = models.CharField(max_length=100)
    aptitude = models.IntegerField()
    base = models.IntegerField()
    f1 = models.IntegerField(null=True, blank=True)
    f2 = models.IntegerField(null=True, blank=True)
    f3 = models.IntegerField(null=True, blank=True)
    f4 = models.IntegerField(null=True, blank=True)
    f5 = models.IntegerField(null=True, blank=True)
    f6 = models.IntegerField(null=True, blank=True)
    f7 = models.IntegerField(null=True, blank=True)
    f8 = models.IntegerField(null=True, blank=True)
    f9 = models.IntegerField(null=True, blank=True)
    f10 = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'aam_marins'

class LocationTp(models.Model):
    id_location_tp = models.AutoField(primary_key=True)
    num_facture = models.CharField(max_length=100)
    surface_louee = models.IntegerField()

    class Meta:
        db_table = 'location_tp'






