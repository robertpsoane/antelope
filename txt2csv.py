INPUT_FILE_PATH = "film_1_carl_rogers_corrected.txt"
OUTPUT_FILE_PATH = "film_1_carl_rogers_corrected.csv"

HEADING = "Sep=^\nSpeaker^Turn^\n"
csv = HEADING
first = True
with open(INPUT_FILE_PATH) as f:
    line  = ""
    for ff in f:
        if ff == "\n":
            # Empty line
            pass
        elif ":" in ff:
            # New turn of speech
            if not first:
                csv += line + "^\n"
            else:
                first = False
            speaker = " ".join(ff.split(" ")[:2])
            line = speaker + "^"
        else:
            line += ff[:-1]


with open(OUTPUT_FILE_PATH, "w") as f:
    f.write(csv)

