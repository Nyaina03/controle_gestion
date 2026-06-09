from rest_framework import serializers
from .models import RecetteAllApmf,Comptes,Ville,Tiers

class RecetteAllApmfSerializer(serializers.ModelSerializer):
    id_compte = serializers.PrimaryKeyRelatedField(queryset=Comptes.objects.all())
    id_ville = serializers.PrimaryKeyRelatedField(queryset=Ville.objects.all())
    id_tiers = serializers.PrimaryKeyRelatedField(queryset=Tiers.objects.all())
    tiers_nom = serializers.SerializerMethodField()
    tiers_type = serializers.CharField(source='id_tiers.id_type_tiers.libelle', read_only=True)
    compte = serializers.CharField(source='id_compte.libelle', read_only=True)  # Assurez-vous d'utiliser la bonne clé
    code_compte = serializers.CharField(source='id_compte.code', read_only=True)  # Assurez-vous que 'code' est bien un attribut
    nom_ville = serializers.CharField(source='id_ville.nom_ville', read_only=True)

    class Meta:
        model = RecetteAllApmf
        fields = [
            'id_recette_apmf_all',
            'id_compte',
            'id_ville',
            'id_tiers',
            'compte',
            'taux_tva',
            'num_facture',
            'libelle',
            'date_facture',
            'montant_ht',
            'tva',
            'montant_ttc',
            'tiers_nom',
            'tiers_type',
            'code_compte',
            'nom_ville',
        ]

    def get_tiers_nom(self, obj):
        if obj.id_tiers:
            tiers = obj.id_tiers
            # Vérifie le type de tiers (1 = Client, 2 = Fournisseur)
            if tiers.id_type_tiers.id_type_tiers == 1:  # Client (Individu)
                return f"{tiers.nom} {tiers.prenoms}"
            elif tiers.id_type_tiers.id_type_tiers == 2:  # Fournisseur (Société)
                return tiers.raison_social
        return None
