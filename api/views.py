import pickle
import threading
import time


from django.http import HttpResponse, FileResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework import generics, permissions
from rest_framework.decorators import permission_classes
from .models import Transcripts, LabellingSchema, LabellingSchemaLevels
from .serializers import (TranscriptSerializer, 
    LabellingSchemaSerializer,  UserSerializer, 
    LabellingSchemaLevelsSerializer, LabellingSchemaWithLevels) 
from .permissions import IsOwner

from .apps import ActiveLearningInterface as AL
# from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import os
import hashlib
import time
from django.http import JsonResponse


from .scripts.processTranscripts import transcript2list
from .scripts.loadTranscript import (loadTranscript, 
    loadTranscriptFromUsername, saveNewTranscript,
    deleteTranscript, loadTranscriptAsCSV)


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

class TranscriptListView(generics.ListCreateAPIView):
    queryset = Transcripts.objects.all()
    serializer_class = TranscriptSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        query_set = self.queryset.filter(UserID=self.request.user)
        query_set = query_set.order_by("-UploadDateTime")
        return query_set
    
    

class TranscriptInstanceView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transcripts.objects.all()
    serializer_class = TranscriptSerializer    
    permission_classes = [IsOwner]

    def get(self, request, *args, **kwargs):
        # Getting default response
        response = super().get(request, *args, **kwargs)
        transcript = loadTranscript(request, response, TRANSCRIPTS_LOCATION)
        response.data["Transcript"] = transcript
        response.data["schema"] = labelling_schema_as_list()
        return response

    def delete(self, request, *args, **kwargs):
        # Get location of documents
        instance = Transcripts.objects.get(pk=kwargs["pk"])
        transcript_location = instance.TranscriptLocation
        
        # Delete documents
        username = request.user.username
        deleteTranscript(username, TRANSCRIPTS_LOCATION, transcript_location)
        
        # delete instance
        instance.delete()
        
        return JsonResponse({"deleted":True})

class LabellingBatch(generics.RetrieveAPIView):
    queryset = Transcripts.objects.all()
    serializer_class = TranscriptSerializer    
    permission_classes = [IsOwner]

    def get(self, request, *args, **kwargs):
        # Getting default response
        response = super().get(request, *args, **kwargs)
        transcript = loadTranscript(request, response, TRANSCRIPTS_LOCATION)
        config_data = load_config()
        n_turns = response.data["NTurns"]
        start_idx = response.data["NextLabelling"]
        end_idx = min(
            start_idx + config_data["batchSize"],
            n_turns
        )
        
        batch = transcript[start_idx:end_idx]
        t0 = time.time()
        for turn in batch:
            turn["prediction"] = AL.model.predict(turn["speech"])
        prediction_time = time.time() - t0
        print(f"Time to predict batch : {prediction_time}")
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
        response.data["schema"] = labelling_schema_as_list()

        return response


@permission_classes([permissions.IsAuthenticated])
@require_http_methods(["PUT"])
def put_labelled_transcript(request):
    data = json.loads(request.body)
    
    # Updating record in db with new NextLabelling
    instance = Transcripts.objects.get(pk=data["id"])
    Serializer = TranscriptSerializer()
    validated_data = {
        "NextLabelling": data["NextLabelling"] + len(data["batch"])
    }
    print(instance)
    serialized = Serializer.update(instance, validated_data)

    # Loading transcript
    username = request.user.username
    transcript_location = data["TranscriptLocation"]
    old_transcript = loadTranscriptFromUsername(username, TRANSCRIPTS_LOCATION,
                                                transcript_location)
    new_transcript = data["batch"]
    
    AL.model.train(new_transcript)
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

 

def labelling_schema_as_list():
    """
    Function to return list of dictionaries representing the Labelling 
    schema in the database
    """
    View = LabellingSchemaWithLevelsListView()
    Serializer = LabellingSchemaWithLevels
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
        "TranscriptName": data["transcript_name"],
        "Notes" : data["transcript_notes"]
    }
    instance = Transcripts.objects.get(pk=data["transcript_id"])
    Serializer = TranscriptSerializer()
    serialized = Serializer.update(instance, validated_data)
    return JsonResponse({"success":True})
    
################
# Schema Views #
################
class LabellingSchemaInstanceView(generics.RetrieveAPIView):
    queryset = LabellingSchema.objects.all()
    serializer_class = LabellingSchemaSerializer

class LabellingSchemaListView(generics.ListAPIView):
    queryset = LabellingSchema.objects.all()
    serializer_class = LabellingSchemaSerializer

class LabellingSchemaWithLevelsInstanceView(generics.RetrieveAPIView):
    queryset = LabellingSchema.objects.all()
    serializer_class = LabellingSchemaWithLevels

class LabellingSchemaWithLevelsListView(generics.ListAPIView):
    queryset = LabellingSchema.objects.all()
    serializer_class = LabellingSchemaWithLevels

class LabellingSchemaWithLevelsListViewAdmin(generics.ListAPIView):
    queryset = LabellingSchema.objects.all()
    serializer_class = LabellingSchemaWithLevels
    permission_classes = [permissions.IsAdminUser]

class LabellingSchemaNewInstance(generics.CreateAPIView):
    queryset = LabellingSchema.objects.all()
    serializer_class = LabellingSchemaSerializer
    permission_classes = [permissions.IsAdminUser]

class LabellingSchemaInstanceEdit(generics.RetrieveUpdateDestroyAPIView):
    queryset = LabellingSchema.objects.all()
    serializer_class = LabellingSchemaSerializer
    permission_classes = [permissions.IsAdminUser]

@require_http_methods(["POST"])
@permission_classes([permissions.IsAdminUser])
def new_labelling_with_levels(request):
    """ new_labelling_with_levels
    Adds a new labelling class, along with the corresponding levels from an
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
    labelling = {
        "ClassName" : name,
        "ClassDescription": description,
        "ClassShort" : short
    }
    response = {"labelling": labelling, "levels":[]}
    SchemaSerializer = LabellingSchemaSerializer()
    LevelsSerializer = LabellingSchemaLevelsSerializer()
    serialized = SchemaSerializer.create(labelling)
    
    for level in data["levels"]:
        levelModel = {"Labelling":serialized, "Level":level}
        LevelsSerializer.create(
            levelModel
        )
        response["levels"].append([serialized.id, level])
    
    return JsonResponse(response)

@require_http_methods(["PUT"])
@permission_classes([permissions.IsAdminUser])
def edit_labelling_with_levels(request):
    """ edit_labelling_with_levels
    Takes an API PUT request and updates any changes to labelling class and
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
    # Compiling new labelling data
    labelling = {
        "ClassName" : name,
        "ClassDescription": description,
        "ClassShort" : short
    }
    response = {"labelling": labelling, "levels":[]}

    # Getting and updating labelling data (not levels)
    instance = LabellingSchema.objects.get(pk=data["id"])
    SchemaSerializer = LabellingSchemaSerializer()
    serialized = SchemaSerializer.update(instance, labelling)

    # Processing levels
    LevelsSerializer = LabellingSchemaLevelsSerializer()
    new_levels = data["levels"]
    old_levels = LabellingSchemaLevels.objects.filter(Labelling=data["id"])
    included_levels = []
    # For each previous level, checking if still in labelling class, 
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
            levelModel = {"Labelling":serialized, "Level":level}
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
    transcript_name = data["name"]
    transcript_notes = data["notes"]
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
    processed_location = os.path.join(transcript_dir, "process.json")

    transcript_document = transcript2list(transcript)

    with open(json_location, "w") as f:
        json.dump(transcript_document, f)

    with open(processed_location, "w") as f:
        json.dump({"processed":False}, f)

    threading.Thread(
        target=process_transcript,
        name="Preprocess Transcript",
        args=(transcript_document, transcript_dir, processed_location),
        daemon=True
    ).start()

    val_data = {
        "UserID": request.user,
        "TranscriptName":transcript_name,
        "Notes":transcript_notes,
        "TranscriptLocation":save_dir,
        "NextLabelling":0,
        "NTurns":len(transcript_document)
           }

    Serializer = TranscriptSerializer()
    Serializer.create(val_data)

    return JsonResponse({"received":True})

def process_transcript(transcript_document, transcript_dir, processed_location):
    print(" >> Making transcript embeddings")
    t0 = time.time()
    embeddings = [
        AL.embedding(turn["speech"]) for turn in transcript_document
    ]
    embeddings_location = os.path.join(transcript_dir, "0.pickle")
    print(" >> Pickling transcript embeddings")
    with open(embeddings_location, "wb") as f:
        pickle.dump(embeddings, f)
    with open(processed_location, "w") as f:
        json.dump({"processed":True}, f)
    processing_time =  time.time() - t0
    print(f" >> Processed transript in {processing_time:.2f} seconds...")
    



class TranscriptDownload(generics.RetrieveAPIView):
    queryset = Transcripts.objects.all()
    serializer_class = TranscriptSerializer    
    permission_classes = [IsOwner]
    
    def get(self, request, *args, **kwargs):
        # Get transcript data
        response = super().get(request, *args, **kwargs)

        # Make file name
        transcript_name = response.data["TranscriptName"]
        transcript_name = "_".join(transcript_name.lower().split(" ")) + ".csv"

        # Make csv
        schema = labelling_schema_as_list()
        csv = loadTranscriptAsCSV(request, response, TRANSCRIPTS_LOCATION, schema)
        return JsonResponse({"file":csv,"name":transcript_name})

