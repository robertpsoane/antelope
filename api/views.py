from api.al.ActiveLearningModel import MODELS_PATH
from api.al import embeddings
import pickle
import threading
import time
from datetime import date


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

import random


from .scripts.processTranscripts import transcript2list
from .scripts.loadTranscript import (loadTranscript, loadEmbeddings, 
    loadTranscriptFromUsername, saveNewTranscript,
    deleteTranscript, loadTranscriptAsCSV, loadTranscriptProcessingStatus)


MODULE_PATH = os.path.dirname(os.path.abspath(__file__))
TRANSCRIPTS_LOCATION = os.path.join(MODULE_PATH, "transcripts")

# Logging controls - saves basic stats of each labelling to log file 
# if True
LOGGING = False
LOGGING_LOCATION = os.path.join(os.path.join(MODULE_PATH, ".."), "logs")

# Experimental Mode
# If true, will switch between random and model based recommendations
EXPERIMENTAL = False
if EXPERIMENTAL:
    LOGGING = True
MODEL = ["model"]
    
def random_predict(input):
    """ random_predict(input)
    Completely disregards the input and instead makes a random prediction
    from the available schema. 
    This is only needed for experimental mode.
    """
    schema = labelling_schema_as_list()
    classes = list(schema.keys())
    class_val = random.choice(classes)
    level_val = random.choice(schema[class_val]["levels"])
    random_predict = {'class': [str(class_val)], 'level': [str(level_val)]}
    return random_predict

def experimental_predict(input):
    """
    Makes predictions for experiments.  Note - if "model", uses random
    predict, if "random" uses model predict - both ways, it switches 
    labels for next time.  This is to ensure label matches actual model
    """
    if MODEL[0] == "model":
        prediction = random_predict(input)
        MODEL[0] = "random"
    else:
        prediction = AL.model.predict(input)
        MODEL[0] = "model"
    return prediction

    
# Defacto API view - doesn't do anything useful, just shows were on the 
# right route
def default_api(request):
    return HttpResponse("API Root")

def test_api(request):
    return HttpResponse("scratchpad api didn't fail")

def append(path, text):
    with open(path, "a") as f:
            f.write(f"\n{text}")

###############
# Login Views #
###############
def user_login(request):
    """ user_login(request)
    Takes http request and if username and password are correct will
    log user in.
    """
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
    """ user_logout(request)
    Logs user out using Django's logout function
    """
    logout(request)
    return JsonResponse({"logout": True})

def get_login_data(request):
    """
    Handles request to tell client if user is logged in.
    """
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
    """ change_password(request)
    Handles POST request to change password.  If old password is correct,
    sets new password and sends success status to client.
    """
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
# The following classes use generic API Views from the Django REST
# framework to `SELECT *` from the table
#
# In some cases these are modified to provide extra functionality.

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
        """
        Modified API view GET request - gets row from SQL table, then
        loads transcript document and schema and adds to response.
        """
        # Getting default response
        response = super().get(request, *args, **kwargs)
        transcript = loadTranscript(request, response, TRANSCRIPTS_LOCATION)
        response.data["Transcript"] = transcript
        response.data["schema"] = labelling_schema_as_list()
        return response

    def delete(self, request, *args, **kwargs):
        """
        Modified API view DELETE request - gets instance to delete, 
        deletes all documents relating to that isntance, then deletes 
        the instance.
        """
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
        """
        Modified generic for GET view
        checks if function is processed - if processed, then fetches 
        next batch of turns, and sends with predictions.
        If not processed, tells teh front end
        """    
        # Getting default response
        response = super().get(request, *args, **kwargs)
        processed = loadTranscriptProcessingStatus(request, response, TRANSCRIPTS_LOCATION)
        if not processed:
            # If background processing isn't complete, return that it is
            # incomplete
            response.data["processed"] = False
            return response

        # Not returned - has been processed.  Load transcript and 
        # embedded transcript, get labels for each embedding
        response.data["processed"] = True
        transcript = loadTranscript(request, response, TRANSCRIPTS_LOCATION)
        embeddings = loadEmbeddings(request, response, TRANSCRIPTS_LOCATION)
        config_data = AL.model.config
        n_turns = response.data["NTurns"]
        start_idx = response.data["NextLabelling"]
        end_idx = min(
            start_idx + config_data["batch_size"],
            n_turns
            )
    
        batch = transcript[start_idx:end_idx]
        embeddings = embeddings[start_idx:end_idx]
        t0 = time.time()
        for idx, turn in enumerate(batch):
            if EXPERIMENTAL:
                turn["prediction"] = experimental_predict(embeddings[idx])
            else:
                turn["prediction"] = AL.model.predict(embeddings[idx])
                # print(turn["prediction"])
            
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

def log_data(data):
    """ log_data(data)
    Adds key data to a log file for today
    """
    today = date.today().strftime("%d-%m-%Y")
    if not os.path.isdir(LOGGING_LOCATION):
        # If no logging directory, make new directory
        os.mkdir(LOGGING_LOCATION)
    
    #  Access todays log file
    file_name = os.path.join(LOGGING_LOCATION, f"{today}.log")
    if not os.path.isfile(file_name):
        #  If new, create file and setup title
        with open(file_name, "w") as f:
            f.write(f"Log {today}\n")
    
    for turn in data["batch"]:
        t = time.localtime()
        time_now = time.strftime("%H:%M:%S", t)
        model_type = MODEL[0]
        time_ = turn["code"]["time"]
        class_ = turn["prediction"]["class"] == turn["code"]["class"]
        level_ = turn["prediction"]["level"] == turn["code"]["level"]
        nwords = len(turn["speech"].split(" "))
        nchar = len(turn["speech"])
        log = f"{time_now}: Model Type - {model_type}, Turn Length (words) - {nwords}, Turn Length (characters) - {nchar}, Accurate Class - {class_}, Accurate Level - {level_}, Time (ms) - {time_}"
        append(file_name, log)


@permission_classes([permissions.IsAuthenticated])
@require_http_methods(["PUT"])
def put_labelled_transcript(request):
    """ put_labelled_transcript(request)
    Updates transcript with new labels, and updates the record in
    with next turn to label.
    """
    data = json.loads(request.body)
    
    if LOGGING:
        log_data(data)

    # Updating record in db with new NextLabelling
    instance = Transcripts.objects.get(pk=data["id"])
    Serializer = TranscriptSerializer()
    validated_data = {
        "NextLabelling": data["NextLabelling"] + len(data["batch"])
    }
    
    serialized = Serializer.update(instance, validated_data)

    # Loading transcript
    username = request.user.username
    transcript_location = data["TranscriptLocation"]
    old_transcript = loadTranscriptFromUsername(username, TRANSCRIPTS_LOCATION,
                                                transcript_location, "json")
    
    new_transcript = data["batch"]

    embeddings = loadTranscriptFromUsername(username, TRANSCRIPTS_LOCATION,
                                                transcript_location, "pickle")
    labelled_embeddings = []

    
    start_idx = data["start"]
    end_idx = data["end"] + 1
    for idx in range(start_idx, end_idx):
        old_transcript[idx]["code"] = new_transcript[idx - start_idx]["code"]
        labelled_embedding = {
            "speech": embeddings[idx][0],
            "class": old_transcript[idx]["code"]["class"],
            "level": old_transcript[idx]["code"]["level"]
        }
        labelled_embeddings.append(labelled_embedding)
        
    AL.model.train(labelled_embeddings)


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
    """ update_transcript_metadata(request)
    PUT function to update transcript metadata via the serializer
    """
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
# The following classes use generic API Views from the Django REST
# framework to `SELECT *` from the table
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
def post_model_config(request):
    """ post_model_config
    Updates the AL model config with the new config file from the user
    request
    """
    new_config = json.loads(request.body)
    AL.model.config = new_config
    return JsonResponse({"success":True})

@require_http_methods(["GET"])
@permission_classes([permissions.IsAdminUser])
def get_model_config(request):
    """ get_model_config
    Gets model config and sends as a JSON
    """
    return JsonResponse(AL.model.config_options)

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
    """
    Manages upload of new transcript.  Stores transcript as a JSON
    in the users document store, then adds a record for the transcript
    in the SQL db
    """
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

    processing_details = {"processed":False}
    with open(processed_location, "w") as f:
        json.dump(processing_details, f)

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
    """
    Generates embeddings for the transcript and dumps them in same 
    directory as the transcript in the document database.
    """
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
        """
        Loads the transcript, and conversts it to a caret delimited csv 
        which is sent back to the client in a JSON
        """
        # Get transcript data
        response = super().get(request, *args, **kwargs)

        # Make file name
        transcript_name = response.data["TranscriptName"]
        transcript_name = "_".join(transcript_name.lower().split(" ")) + ".csv"

        # Make csv
        schema = labelling_schema_as_list()
        csv = loadTranscriptAsCSV(request, response, TRANSCRIPTS_LOCATION, schema)
        return JsonResponse({"file":csv,"name":transcript_name})

