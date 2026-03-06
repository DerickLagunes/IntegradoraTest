import base64

from django.db import models

class Mascota(models.Model):
    # Definimos opciones para la especie
    ESPECIES_CHOICES = [
        ('perro', 'Perro'),
        ('gato', 'Gato'),
        ('otro', 'Otro'),
    ]

    nombre = models.CharField(max_length=100)
    especie = models.CharField(max_length=10, choices=ESPECIES_CHOICES, default='perro')
    edad = models.PositiveIntegerField()
    descripcion = models.TextField(blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    # CAMPO PARA GUARDAR LA IMAGEN EN EL BACK
    # upload_to='mascotas/' creará una carpeta llamada "mascotas" dentro de tu directorio "media"
    foto = models.ImageField(upload_to='mascotas/', blank=True, null=True)

    # CAMPO BINARIO PARA LA IMAGEN EN LA BD
    foto_binaria = models.BinaryField(blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} ({self.especie})"
    
    @property
    def foto_base64(self):
        if self.foto_binaria:
            # Convierte los bytes a un string codificado en base64
            codificado = base64.b64encode(self.foto_binaria).decode('utf-8')
            return f"data:image/jpeg;base64,{codificado}"
        return None