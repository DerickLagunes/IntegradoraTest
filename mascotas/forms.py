from django import forms
from .models import Mascota
from django.core.exceptions import ValidationError
import re

class MascotaForm(forms.ModelForm):
    class Meta:
        model = Mascota
        # Definimos qué campos queremos mostrar en el formulario
        fields = ['nombre', 'especie', 'edad', 'descripcion']
        
        # Opcional: Añadimos etiquetas personalizadas para que se vean mejor
        labels = {
            'nombre': 'Nombre de la mascota',
            'especie': '¿Qué animal es?',
            'edad': 'Edad (en años)',
            'descripcion': 'Cuéntanos algo sobre ella',
        }
        
        # Opcional: Podemos añadir estilos (como clases de CSS para Bootstrap)
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej. Firulais'}),
            'descripcion': forms.Textarea(attrs={'rows': 3, 'class': 'form-control'}),
        }

    #validar la información que me va a llegar en el nombre
    def clean_nombre(self):
        data = self.cleaned_data['nombre']
        if not re.match('^[a-zA-Z]+$',data):
            #Validation error llena un atributo del form con errores cuando sucede
            raise ValidationError("Solo puedes registrar nombres con letras")
        return data
