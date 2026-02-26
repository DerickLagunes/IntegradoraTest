from django.shortcuts import render

def index(request):
    return render(request, 'core/index.html')

def carreras(request):
    return render(request, 'core/carreras.html')