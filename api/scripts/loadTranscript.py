# Script to load users transcript
import os, json, pickle


def loadTranscriptProcessingStatus(request, response, transcript_root):
    # Loading saved transcript
    # Getting location of all versions
    username = request.user.username
    transcript_location = response.data["TranscriptLocation"]
    
    user_dir = os.path.join(transcript_root, username)
    transcript_dir = os.path.join(user_dir, transcript_location)
    status_loc = os.path.join(transcript_dir, "process.json")

    with open(status_loc, "r") as f:
        status = json.load(f)
    return status["processed"]

def loadEmbeddings(request, response, transcript_root):
    # Loading saved transcript
    # Getting location of all versions
    username = request.user.username
    transcript_location = response.data["TranscriptLocation"]
    
    transcript = loadTranscriptFromUsername(
                username, transcript_root, transcript_location,"pickle")

    return transcript

def loadTranscript(request, response, transcript_root):
    # Loading saved transcript
    # Getting location of all versions
    username = request.user.username
    transcript_location = response.data["TranscriptLocation"]
    
    transcript = loadTranscriptFromUsername(username, transcript_root, transcript_location)

    return transcript

def get_typed_file_names(transcript_dir, ftype):
    file_names = os.listdir(transcript_dir)
    typed_file_names = [
        int(file_name.split(".")[0])
        for file_name in file_names 
        if 
            (file_name.split(".")[1] == ftype) 
        and
            (file_name.split(".")[0].isdigit())
        ]
    return typed_file_names

def loadTranscriptFromUsername(username, transcript_root, transcript_location, ftype="json"):
    if ftype == "pickle":
        pass
    else:
        ftype = "json"
    
    user_dir = os.path.join(transcript_root, username)
    transcript_dir = os.path.join(user_dir, transcript_location)
    

    # Finding latest version of filename
    
    latest_file = str(max(get_typed_file_names(transcript_dir, ftype))) + f".{ftype}"
    transcript_loc = os.path.join(transcript_dir, latest_file)
    
    # Loading transcript
    if ftype == "pickle":
        with open(transcript_loc, "rb") as f:    
            transcript = pickle.load(f)
    else:
        with open(transcript_loc) as f:
            transcript = json.load(f)

    return transcript

def saveNewTranscript(transcript, username, transcript_root, transcript_location):
    user_dir = os.path.join(transcript_root, username)
    transcript_dir = os.path.join(user_dir, transcript_location)
    file_names = os.listdir(transcript_dir)

     # Finding latest version of filename
    file = str(max(get_typed_file_names(transcript_dir, "json"))) + ".json"
    transcript_loc = os.path.join(transcript_dir, file)
    
    with open(transcript_loc, "w") as f:
        json.dump(transcript, f)

def deleteTranscript(username, transcript_root, transcript_location):
    user_dir = os.path.join(transcript_root, username)
    transcript_dir = os.path.join(user_dir, transcript_location)
    file_names = os.listdir(transcript_dir)

    for file in file_names:
        file_path = os.path.join(transcript_dir, file)
        os.remove(file_path)
    os.rmdir(transcript_dir)

def loadTranscriptAsCSV(request, response, transcript_root, schema):
    transcript = loadTranscript(request, response, transcript_root)
    csv = "sep=^\nSpeaker^Turn^Label^Level^\n"
    for turn in transcript:
        speaker = turn["speaker"]
        speech = turn["speech"]
        code = turn["code"]
        if code is not None:
            code_desc = schema[int(code["class"])]
            code_level = code["level"]
            code_class = code_desc["ClassShort"]
        else:
            code_level, code_class = "", ""
        line = f"{speaker}^{speech}^{code_class}^{code_level}^\n"
        csv += line
    return csv
