import hashlib

def transcript2dict(transcript):
    """
    Converts transcript from input csv to a dictionary.
    """
     # Process transcript into JSON 'linked list'
    # Extracting conversation from transcript csv data
    transcript = transcript.split("^")[3:-1]
    
    # Calculating number of turns
    n_turns = len(transcript) // 2

    transcript_document = {
        "start":0,
        "end":n_turns-1
    }
    
    # For each turn, extract corresponding speaker and speech and add to
    # dictionary within document - Keys are irrelevant, can add new keys
    # at a later date for fast insertion. 
    for n in range(n_turns):
        speaker = transcript[2*n]
        speech = transcript[2*n + 1]
        key = n
        transcript_document[key] = {
            "speaker":speaker,
            "speech":speech,
            "next": key + 1,
            "code": None
        }
    # Retrospectively map last element in document to "end"
    transcript_document[transcript_document["end"]]["next"] = "end"

    return transcript_document
