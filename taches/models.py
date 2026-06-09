from django.db import models

class Taches(models.Model):
    STATUT_CHOICES = [
        ('Non commencé', 'Non commencé'),
        ('En cours', 'En cours'),
        ('Terminé', 'Terminé'),
    ]
    id_tache = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=255)
    descriptions = models.TextField(blank=True, null=True)
    date_debut = models.DateField()
    date_limite = models.DateField()
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default='Non commencé')
    id_utilisateur = models.ForeignKey(
        'utilisateur.Utilisateur',  # Référence au modèle via une chaîne
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column ='id_utilisateur'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titre

    class Meta:
        db_table = 'taches'
