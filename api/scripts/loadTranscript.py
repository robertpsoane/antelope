# Script to load users transcript
import os, json


def loadTranscript(request, response, transcript_root):
    # Loading saved transcript
    # Getting location of all versions
    username = request.user.username
    transcript_location = response.data["TranscriptLocation"]
    
    transcript = loadTranscriptFromUsername(username, transcript_root, transcript_location)

    return transcript

def loadTranscriptFromUsername(username, transcript_root, transcript_location):
    user_dir = os.path.join(transcript_root, username)
    transcript_dir = os.path.join(user_dir, transcript_location)
    file_names = os.listdir(transcript_dir)

    # Finding latest version of filename
    json_file_names = [
        int(file_name.split(".")[0])
        for file_name in file_names 
        if 
            (file_name.split(".")[1] == "json") 
        and
            (file_name.split(".")[0].isdigit())
        ]
    latest_file = str(max(json_file_names)) + ".json"
    transcript_loc = os.path.join(transcript_dir, latest_file)
    
    # Loading transcript
    with open(transcript_loc) as f:
        transcript = json.load(f)

    return transcript

def saveNewTranscript(transcript, username, transcript_root, transcript_location):
    user_dir = os.path.join(transcript_root, username)
    transcript_dir = os.path.join(user_dir, transcript_location)
    file_names = os.listdir(transcript_dir)

     # Finding latest version of filename
    file = str(max([int(file_name[:-5]) for file_name in file_names])+1) + ".json"
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
