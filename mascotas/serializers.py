from rest_framework import serializers
from .models import Mascota

class MascotaSerializer(serializers.ModelSerializer):
    # Campos virtuales, de apoyo
    foto_para_binario = serializers.ImageField(write_only=True, required=False)
    foto_base64_display = serializers.ReadOnlyField(source='foto_base64')

    class Meta:
        model = Mascota
        fields = [
            'id', 'nombre', 'especie', 'edad', 'descripcion', 
            'fecha_registro', 'foto', 'foto_para_binario', 'foto_base64_display'
        ]

    def create(self, validated_data):
        # Extraemos el segundo archivo (el que va a la base de datos), es nulo si no lo mandaron
        archivo_binario = validated_data.pop('foto_para_binario', None)

        # DRF guarda 'foto' automáticamente en la carpeta /media/
        mascota = Mascota.objects.create(**validated_data)

        # Si nos mandaron el segundo archivo, leemos sus bytes crudos y los guardamos
        if archivo_binario:
            # .read() extrae los bytes del archivo, ¡no se necesita base64 aquí!
            mascota.foto_binaria = archivo_binario.read()
            mascota.save()

        return mascota