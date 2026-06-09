from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class Utilisateur(models.Model):
    id_utilisateur = models.AutoField(primary_key=True)
    mail = models.EmailField(unique=True, null=False, blank=False)
    mdp = models.CharField(max_length=255, blank=False, null=False)  # Stockage du mot de passe haché
    statut = models.IntegerField(default=5, blank=True, null=True)

    class Meta:
        db_table = 'utilisateur'

    def set_password(self, raw_password):
        """Hache et enregistre le mot de passe"""
        self.mdp = make_password(raw_password)

    def check_password(self, raw_password):
        """Vérifie si le mot de passe fourni correspond au mot de passe haché"""
        return check_password(raw_password, self.mdp)

    def save(self, *args, **kwargs):
        """Hash le mot de passe seulement s'il n'est pas encore haché"""
        if not self.mdp.startswith('pbkdf2_sha256$'):
            self.mdp = make_password(self.mdp)
        super().save(*args, **kwargs)
