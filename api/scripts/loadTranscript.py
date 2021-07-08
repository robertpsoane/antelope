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
    latest_file = str(max([int(file_name[:-5]) for file_name in file_names])) + ".json"
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
