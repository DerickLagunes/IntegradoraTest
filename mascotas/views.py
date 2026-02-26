from django.shortcuts import render

from rest_framework import viewsets
from .models import Mascota  # <--- El modelo 
from .serializers import MascotaSerializer # <-- El serializador del modelo

class MascotaViewSet(viewsets.ModelViewSet):
    queryset = Mascota.objects.all()
    serializer_class = MascotaSerializer
