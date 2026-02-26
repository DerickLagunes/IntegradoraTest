from rest_framework import serializers
from .models import Mascota  # <--- Aquí va el o los modelos a serializar

class MascotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mascota
        fields = '__all__' # Expone todos los campos del modelo (id, nombre, especie, etc.)