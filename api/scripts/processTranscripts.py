import hashlib

def transcript2list(transcript):
    """
    Converts transcript from input csv to a dictionary.
    """
    # Process transcript into JSON
    # Extracting conversation from transcript csv data
    transcript = transcript.split("^")[3:-1]
    
    # Calculating number of turns
    n_turns = len(transcript) // 2

    transcript_list = []
    
    
    # For each turn, extract corresponding speaker and speech and add to
    # dictionary within document - Keys are irrelevant, can add new keys
    # at a later date for fast insertion. 
    for n in range(n_turns):
        speaker = transcript[2*n]
        speech = transcript[2*n + 1]
        transcript_list.append({
            "speaker": speaker,
            "speech": speech,
            "code": None
        })    

    return transcript_list
