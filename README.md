# Antelope: Transcript Labelling

Antelope (**A**n **N**LP **T**ranscript **L**abelling **P**rogram), is an open source system for labelling dialogue transcripts.
While specifically designed for labelling Psychiatric transcript data, Antelope can be used to label any transcripts with classes defined by an administrator.

Antelope was designed for my MSc Project at the University of Nottingham.

## Manuals

For all instructions, see the following manuals:

- **[User Manual](https://github.com/robertpsoane/antelope/wiki/User-Manual)** - All instructions for using Antelope as a user.
- **[Administrator Manual](https://github.com/robertpsoane/antelope/wiki/Administrator-Manual)** - Instructions for all administrator tasks.
- **[Installation Manual](https://github.com/robertpsoane/antelope/wiki/Installation-Manual)** - Installation and setup instructions.

# Code Structure

- The backend can be found in `api`.
- - The API endpoints can be found in `api > views.py`
- - The endpoint URL routing can be found in `api > urls.py`
- - The database models and serializers can be found in `api > models.py` and `api > serializers.py` respectively
- The frontend can be found in `frontend`.
- - The static built frontend can be found in `frontend > static`
- - The frontend source code can be found in `frontend > src`

# Sample Files
A sample of the CICS schema as well as a template JSON is included in the `_sample_files` directory.

The CICS scheme can be found here:
Malins, S., Moghaddam, N., Morriss, R., Schroder, T., Cope, N., & Brown, P. (2018). Consultation Interaction Coding Scheme 1.6. Retrieved 7 Sep from https://figshare.com/articles/Consultation_Interaction_Coding_Scheme_CICS_/7302386


