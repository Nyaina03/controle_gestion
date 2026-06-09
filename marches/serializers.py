from rest_framework import serializers
from .models import Marches
from comptes.serializers import ComptesSerializer
from financement.serializers import FinancementSerializer
from typeDepense.serializers import TypeDepenseSerializer
from rest_framework import serializers
from .models import AttachementParCompte

class MarcheSerializer(serializers.ModelSerializer):
    compte = ComptesSerializer(source='id_compte', required=False)
    financement = FinancementSerializer(source='id_financement', required=False)
    type_depense = TypeDepenseSerializer(source='id_type_depense', required=False)

    class Meta:
        model = Marches
        fields = ['id_marche', 'annee', 'num_marche', 'compte', 'financement', 'type_depense',
                  'objet_marche', 'attributaire', 'montant_ht', 'tva', 'num_os', 'date_os',
                  'num_sur_registre', 'delai_en_jour', 'date_signature', 'date_notification', 'observation']

    def update(self, instance, validated_data):
        # Mettre à jour les champs imbriqués s'ils sont présents
        if 'id_compte' in validated_data:
            compte_data = validated_data.pop('id_compte')
            instance.id_compte_id = compte_data.get('id_compte', instance.id_compte_id)

        if 'id_financement' in validated_data:
            financement_data = validated_data.pop('id_financement')
            instance.id_financement_id = financement_data.get('id_financement', instance.id_financement_id)

        if 'id_type_depense' in validated_data:
            type_depense_data = validated_data.pop('id_type_depense')
            instance.id_type_depense_id = type_depense_data.get('id_type_depense', instance.id_type_depense_id)

        # Mettre à jour les autres champs de `Marches`
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance



class AttachementParCompteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttachementParCompte
        fields = ['id_marche', 'annee_paiement', 'num_attachement', 'montant']

