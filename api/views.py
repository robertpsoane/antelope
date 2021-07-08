from django.db.models.query import InstanceCheckMeta
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework import generics, permissions, serializers
from rest_framework.decorators import permission_classes
from .models import CodingSessions, CodingSchema, CodingSchemaLevels
from .serializers import (CodingSessionsSerializer, 
    CodingSchemaSerializer,  UserSerializer, 
    CodingSchemaLevelsSerializer, CodingSchemaWithLevels) 
from .permissions import IsOwner

from .al.ActiveLearningInterface import ActiveLearningInterface
# from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import os
import hashlib
import time
from django.http import JsonResponse

from .scripts.processTranscripts import transcript2list
from .scripts.loadTranscript import (loadTranscript, 
    loadTranscriptFromUsername, saveNewTranscript)


# Create your views here.

MODULE_PATH = os.path.dirname(os.path.abspath(__file__))
TRANSCRIPTS_LOCATION = os.path.join(MODULE_PATH, "transcripts")
MODELCONFIG_LOCATION = os.path.join(
    os.path.join(MODULE_PATH, ".."),
    "modelconfig.json")

## Load Config Data
def load_config():
    with open(MODELCONFIG_LOCATION) as f:
        config = json.load(f)
    return config

# Defacto API view - doesn't do anything useful, just shows were on the 
# right route
def default_api(request):
    return HttpResponse("API Root")

def test_api(request):
    return HttpResponse("scratchpad api didn't fail")

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
    permission_classes = [IsOwner]

    def get_queryset(self):
        return self.queryset.filter(UserID=self.request.user)

class CodingSessionsInstanceView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CodingSessions.objects.all()
    serializer_class = CodingSessionsSerializer    
    permission_classes = [IsOwner]

    def get(self, request, *args, **kwargs):
        # Getting default response
        response = super().get(request, *args, **kwargs)
        transcript = loadTranscript(request, response, TRANSCRIPTS_LOCATION)
        response.data["Transcript"] = transcript
        return response

class LabellingBatch(generics.RetrieveAPIView):
    queryset = CodingSessions.objects.all()
    serializer_class = CodingSessionsSerializer    
    permission_classes = [IsOwner]

    def get(self, request, *args, **kwargs):
        # Getting default response
        response = super().get(request, *args, **kwargs)
        transcript = loadTranscript(request, response, TRANSCRIPTS_LOCATION)
        config_data = load_config()
        n_turns = response.data["NTurns"]
        start_idx = response.data["NextCoding"]
        end_idx = min(
            start_idx + config_data["batchSize"],
            n_turns
        )
        
        batch = transcript[start_idx:end_idx]
        model = ActiveLearningInterface()
        for turn in batch:
            turn["prediction"] = model.predict(turn["speech"])
        response.data["batch"] = batch

        if start_idx != 0:
            previous_turn = transcript[start_idx - 1]
        else:
            previous_turn = None
        if end_idx < n_turns:
            next_turn = transcript[end_idx]
        else:
            next_turn = None
        response.data["previous"] = previous_turn
        response.data["next"] = next_turn
        response.data["start"] = start_idx
        response.data["end"] = end_idx - 1
        response.data["schema"] = coding_schema_as_list()
        print(f"Sending {start_idx}")

        return response


@permission_classes([permissions.IsAuthenticated])
@require_http_methods(["PUT"])
def put_labelled_transcript(request):
    data = json.loads(request.body)
    
    # Updating record in db with new NextCoding
    instance = CodingSessions.objects.get(pk=data["id"])
    Serializer = CodingSessionsSerializer()
    validated_data = {
        "NextCoding": data["NextCoding"] + len(data["batch"])
    }
    print(instance)
    serialized = Serializer.update(instance, validated_data)

    # Loading transcript
    username = request.user.username
    transcript_location = data["TranscriptLocation"]
    old_transcript = loadTranscriptFromUsername(username, TRANSCRIPTS_LOCATION,
                                                transcript_location)
    new_transcript = data["batch"]
    model = ActiveLearningInterface()
    model.train(new_transcript)
    start_idx = data["start"]
    end_idx = data["end"] + 1
    for idx in range(start_idx, end_idx):
        old_transcript[idx]["code"] = new_transcript[idx - start_idx]["code"]

        # Below two lines only needed if possibility of server side edits
        # old_transcript["idx"]["speaker"] = new_transcript["idx"]["speaker"]
        # old_transcript["idx"]["speech"] = new_transcript["idx"]["speech"]

    # Saving new transcript
    saveNewTranscript(old_transcript, username, TRANSCRIPTS_LOCATION, 
                                                transcript_location)
    
    return JsonResponse({"success":True})

 

def coding_schema_as_list():
    """
    Function to return list of dictionaries representing the coding 
    schema in the database
    """
    View = CodingSchemaWithLevelsListView()
    Serializer = CodingSchemaWithLevels
    schema = {
        instance["id"] : {
            "ClassName" :  instance["ClassName"],
            "ClassShort":  instance["ClassShort"],
            "levels" : instance["levels"]
        }
        for instance 
        in [
            Serializer(instance).data 
            for instance 
            in View.get_queryset()
        ]
    }
    return schema



@permission_classes([permissions.IsAuthenticated])
@require_http_methods(["PUT"])
def update_transcript_metadata(request):
    data = json.loads(request.body)
    validated_data = {
        "SessionName": data["transcript_name"],
        "Notes" : data["transcript_notes"]
    }
    instance = CodingSessions.objects.get(pk=data["transcript_id"])
    Serializer = CodingSessionsSerializer()
    serialized = Serializer.update(instance, validated_data)
    return JsonResponse({"success":True})
    
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

# Process new transcript and add to database
@permission_classes([permissions.IsAuthenticated])
def new_transcript(request):
    data = json.loads(request.body)
    session_name = data["name"]
    session_notes = data["notes"]
    transcript = data["text"]
    upload_file_name = data["file_name"]
    
    # Hashing file name with upload time to generate unique name for 
    # document
    str_to_hash = upload_file_name + str(time.time()) 
    save_dir = hashlib.md5(str_to_hash.encode()).hexdigest()
    
    # Get location to store transcript documents
    username = request.user.username
    user_transcripts = os.path.join(TRANSCRIPTS_LOCATION, username)
    if not os.path.isdir(user_transcripts):
        os.mkdir(user_transcripts)
    transcript_dir = os.path.join(user_transcripts, save_dir)
    os.mkdir(transcript_dir)
    json_location = os.path.join(transcript_dir, "0.json")

    transcript_document = transcript2list(transcript)

    with open(json_location, "w") as f:
        json.dump(transcript_document, f)

    val_data = {
        "UserID": request.user,
        "SessionName":session_name,
        "Notes":session_notes,
        "TranscriptLocation":save_dir,
        "NextCoding":0,
        "NTurns":len(transcript_document)
           }

    SessionSerializer = CodingSessionsSerializer()
    SessionSerializer.create(val_data)

    return JsonResponse({"received":True})
