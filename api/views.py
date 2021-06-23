from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from .models import CodingSessions, Turns, CodingClasses, Codings
from .serializers import CodingSessionsSerializer, TurnsSerializer, CodingClassesSerializer, CodingsSerializer
# Create your views here.
def default_api(request):
    return HttpResponse("API Root")

class CodingSessionsView(generics.CreateAPIView):
    queryset = CodingSessions.objects.all()
    serializer_class = CodingSessionsSerializer

class TurnsView(generics.CreateAPIView):
    queryset = Turns.objects.all()
    serializer_class = TurnsSerializer

class CodingClassesView(generics.CreateAPIView):
    queryset = CodingClasses.objects.all()
    serializer_class = CodingClassesSerializer

class CodingsView(generics.CreateAPIView):
    queryset = Codings.objects.all()
    serializer_class = CodingsSerializer