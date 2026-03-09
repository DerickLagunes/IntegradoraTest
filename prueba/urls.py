from django.urls import path, include
from core import views as core
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('', core.index, name='index'),
    path('carreras/', core.carreras, name='carreras'),
    path('', include('mascotas.urls')),

    # Endpoint para iniciar sesión (recibe email y password, devuelve access y refresh tokens)
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Endpoint para refrescar el token (recibe el refresh token, devuelve un nuevo access token)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Esto permite visualizar las imágenes en modo DEBUG (desarrollo)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
