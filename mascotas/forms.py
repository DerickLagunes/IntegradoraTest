from django import forms
from .models import Mascota
from django.core.exceptions import ValidationError
import re

class MascotaForm(forms.ModelForm):
    # CREAMOS UN CAMPO VIRTUAL PARA EL ARCHIVO BINARIO
    # Este campo no existe en el modelo directamente, lo usamos solo para recibir el archivo
    foto_para_bd = forms.ImageField(
        required=False, 
        label='Sube la foto para la Base de Datos (Binario)',
        widget=forms.ClearableFileInput(attrs={'class': 'form-control'})
    )
    class Meta:
        model = Mascota
        # Definimos qué campos queremos mostrar en el formulario
        fields = ['nombre', 'especie', 'edad', 'descripcion', 'foto']
        
        # Opcional: Añadimos etiquetas personalizadas para que se vean mejor
        labels = {
            'nombre': 'Nombre de la mascota',
            'especie': '¿Qué animal es?',
            'edad': 'Edad (en años)',
            'descripcion': 'Cuéntanos algo sobre ella',
            'foto': 'Sube la foto para la carpeta (Media)',
        }
        
        # Opcional: Podemos añadir estilos (como clases de CSS para Bootstrap)
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej. Firulais'}),
            'descripcion': forms.Textarea(attrs={'rows': 3, 'class': 'form-control'}),
            'foto': forms.ClearableFileInput(attrs={'class': 'form-control'}),
        }

    #validar la información que me va a llegar en el nombre
    def clean_nombre(self):
        data = self.cleaned_data['nombre']
        if not re.match('^[a-zA-Z]+$',data):
            #Validation error llena un atributo del form con errores cuando sucede
            raise ValidationError("Solo puedes registrar nombres con letras")
        return data

    # INTERCEPTAMOS EL GUARDADO PARA PROCESAR LOS BYTES
    def save(self, commit=True):
        # Generamos la instancia del modelo pero pausamos el guardado en la BD (commit=False)
        instancia = super().save(commit=False)
        
        # Recuperamos el archivo que el usuario subió en nuestro campo virtual
        archivo_bd = self.cleaned_data.get('foto_para_bd')
        
        if archivo_bd:
            # .read() extrae los ceros y unos (bytes) del archivo
            # Y se los asignamos al campo BinaryField real del modelo
            instancia.foto_binaria = archivo_bd.read()
            
        # Ahora sí, guardamos en la base de datos
        if commit:
            instancia.save()
            
        return instancia