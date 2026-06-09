from rest_framework import serializers
from .models import DRSN
from .models import DSM
from .models import DM
from .models import VAS
from .models import LocationTp
from .models import AAMMarins

class DRSNSerializer(serializers.ModelSerializer):
    class Meta:
        model = DRSN
        fields = '__all__'

class DSMSerializer(serializers.ModelSerializer):
    class Meta:
        model = DSM
        fields = '__all__'

class DMSerializer(serializers.ModelSerializer):
    class Meta:
        model = DM
        fields = '__all__'

class VASSerializer(serializers.ModelSerializer):
    class Meta:
        model = VAS
        fields = '__all__'

class AAMMarinSerializer(serializers.ModelSerializer):
    class Meta:
        model = AAMMarins
        fields = '__all__'

class LocationTpSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationTp
        fields = '__all__'


