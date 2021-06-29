from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework import generics, permissions, serializers
from rest_framework.decorators import permission_classes
from .models import CodingSessions, Turns, CodingSchema, CodingSchemaLevels, Codings
from .serializers import (CodingSessionsSerializer, TurnsSerializer, 
    CodingSchemaSerializer, CodingsSerializer, UserSerializer, 
    CodingSchemaLevelsSerializer, CodingSchemaWithLevels) 
from .permissions import IsOwner
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
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

###################
# Change password #
###################
@require_http_methods(["POST"])
def change_password(request):
    # Extract request data
    data = json.loads(request.body)
    username = request.user.username
    old = data['old']
    new = data['new']
    user = authenticate(request, username=username, password=old)
    if user is not None:
        # password correct
        # Change password and save
        user.set_password(new)
        user.save()
        # Log user back in
        login(request, user)
        out = {"success": True}
    else:
        out = {"success": False}
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

################
# Schema Views #
################
class CodingSchemaInstanceView(generics.RetrieveAPIView):
    queryset = CodingSchema.objects.all()
    serializer_class = CodingSchemaSerializer

class CodingSchemaListView(generics.ListAPIView):
    queryset = CodingSchema.objects.all()
    serializer_class = CodingSchemaSerializer

class CodingSchemaWithLevelsInstanceView(generics.RetrieveAPIView):
    queryset = CodingSchema.objects.all()
    serializer_class = CodingSchemaWithLevels

class CodingSchemaWithLevelsListView(generics.ListAPIView):
    queryset = CodingSchema.objects.all()
    serializer_class = CodingSchemaWithLevels

class CodingSchemaWithLevelsListViewAdmin(generics.ListAPIView):
    queryset = CodingSchema.objects.all()
    serializer_class = CodingSchemaWithLevels
    permission_classes = [permissions.IsAdminUser]

class CodingSchemaNewInstance(generics.CreateAPIView):
    queryset = CodingSchema.objects.all()
    serializer_class = CodingSchemaSerializer
    permission_classes = [permissions.IsAdminUser]

class CodingSchemaInstanceEdit(generics.RetrieveUpdateDestroyAPIView):
    queryset = CodingSchema.objects.all()
    serializer_class = CodingSchemaSerializer
    permission_classes = [permissions.IsAdminUser]

@require_http_methods(["POST"])
@permission_classes([permissions.IsAdminUser])
def new_coding_with_levels(request):
    """ new_coding_with_levels
    Adds a new coding class, along with the corresponding levels from an
    api request
    """
    # Extract request data
    data = json.loads(request.body)
    name = data["name"]
    description = data["description"]
    if "short" in data:
        short = data["short"]
    else:
        short = name[:1]
    coding = {
        "ClassName" : name,
        "ClassDescription": description,
        "ClassShort" : short
    }
    response = {"coding": coding, "levels":[]}
    SchemaSerializer = CodingSchemaSerializer()
    LevelsSerializer = CodingSchemaLevelsSerializer()
    serialized = SchemaSerializer.create(coding)
    
    for level in data["levels"]:
        levelModel = {"Coding":serialized, "Level":level}
        LevelsSerializer.create(
            levelModel
        )
        response["levels"].append([serialized.id, level])
    
    return JsonResponse(response)

@require_http_methods(["PUT"])
@permission_classes([permissions.IsAdminUser])
def edit_coding_with_levels(request):
    """ edit_coding_with_levels
    Takes an API PUT request and updates any changes to coding class and
    corresponding levels
    """
    # Unpacking request
    data = json.loads(request.body)
    name = data["name"]
    description = data["description"]
    if "short" in data:
        short = data["short"]
    else:
        short = name[:1]
    # Compiling new coding data
    coding = {
        "ClassName" : name,
        "ClassDescription": description,
        "ClassShort" : short
    }
    response = {"coding": coding, "levels":[]}

    # Getting and updating coding data (not levels)
    instance = CodingSchema.objects.get(pk=data["id"])
    SchemaSerializer = CodingSchemaSerializer()
    serialized = SchemaSerializer.update(instance, coding)

    # Processing levels
    LevelsSerializer = CodingSchemaLevelsSerializer()
    new_levels = data["levels"]
    old_levels = CodingSchemaLevels.objects.filter(Coding=data["id"])
    included_levels = []
    # For each previous level, checking if still in coding class, 
    # removing any which aren't
    for level in old_levels:
        level_num = level.Level
        if level_num not in new_levels:
            level.delete()
        else:
            included_levels.append(level_num)
    # Checking for any new levels and adding to db
    for level in new_levels:
        if level not in included_levels:
            levelModel = {"Coding":serialized, "Level":level}
            LevelsSerializer.create(
                levelModel
            )
        response["levels"].append(level)

    # Returning new record as a JSON
    return JsonResponse(response)

#################
# Codings Views #
#################

class CodingsListView(generics.ListCreateAPIView):
    queryset = Codings.objects.all()
    serializer_class = CodingsSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

class CodingsInstanceView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Codings.objects.all()
    serializer_class = CodingsSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

