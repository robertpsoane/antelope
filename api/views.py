from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework import generics, permissions
from .models import CodingSessions, Turns, CodingClasses, Codings
from .serializers import (CodingSessionsSerializer, TurnsSerializer, 
    CodingClassesSerializer, CodingsSerializer, UserSerializer)
from .permissions import IsOwner
from django.views.decorators.csrf import csrf_exempt
import json

from django.http import JsonResponse

# Create your views here.

# Defacto API view - doesn't do anything useful, just shows were on the 
# right route
def default_api(request):
    return HttpResponse("API Root")

###############
# Login Views #
###############
def user_login(request):
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        out = {"login": True, "uid": user.id}
    else:
        out ={"login": False}
    return JsonResponse(out)

def user_logout(request):
    logout(request)
    return JsonResponse({"logout": True})

def get_login_data(request):
    out = {
        "login": request.user.is_authenticated,
        "admin": request.user.is_staff
        }
    if out['login']:
        out["username"] = request.user.username
    return JsonResponse(out)
    
      

##############
# User Views #
##############
class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer



class CodingSessionsListView(generics.ListCreateAPIView):
    queryset = CodingSessions.objects.all()
    serializer_class = CodingSessionsSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

class CodingSessionsInstanceView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CodingSessions.objects.all()
    serializer_class = CodingSessionsSerializer    
    permission_classes = [permissions.IsAuthenticated, IsOwner]

class TurnsListView(generics.ListCreateAPIView):
    queryset = Turns.objects.all()
    serializer_class = TurnsSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

class TurnsInstanceView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Turns.objects.all()
    serializer_class = TurnsSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

class CodingClassesInstanceView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CodingClasses.objects.all()
    serializer_class = CodingClassesSerializer

class CodingClassesListView(generics.ListCreateAPIView):
    queryset = CodingClasses.objects.all()
    serializer_class = CodingClassesSerializer

class CodingsListView(generics.ListCreateAPIView):
    queryset = Codings.objects.all()
    serializer_class = CodingsSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

class CodingsInstanceView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Codings.objects.all()
    serializer_class = CodingsSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
