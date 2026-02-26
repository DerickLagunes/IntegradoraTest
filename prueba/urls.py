from django.urls import path, include
from core import views as core

urlpatterns = [
    path('', core.index, name='index'),
    path('carreras/', core.carreras, name='carreras'),
    path('', include('mascotas.urls')),
]
