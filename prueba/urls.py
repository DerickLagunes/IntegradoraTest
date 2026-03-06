from django.urls import path, include
from core import views as core
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', core.index, name='index'),
    path('carreras/', core.carreras, name='carreras'),
    path('', include('mascotas.urls')),
]

# Esto permite visualizar las imágenes en modo DEBUG (desarrollo)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
