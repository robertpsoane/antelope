from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE

# Create your models here.
class Transcripts(models.Model):
    UserID = models.ForeignKey(User, on_delete=CASCADE, related_name="user_transcripts")
    TranscriptName = models.CharField(max_length=100, default="")
    Notes = models.TextField(max_length=1000)
    TranscriptLocation = models.CharField(max_length=255)
    NextLabelling = models.IntegerField()
    NTurns = models.IntegerField()
    UploadDate = models.DateField(auto_now_add=True) 
    UploadTime = models.TimeField(auto_now_add=True) 
    UploadDateTime = models.DateTimeField(auto_now_add=True) 

class LabellingSchema(models.Model):
    ClassName = models.CharField(max_length=30)
    ClassShort = models.CharField(max_length=3, null=True)
    ClassDescription = models.TextField(max_length=1000)

class LabellingSchemaLevels(models.Model):
    Labelling = models.ForeignKey(LabellingSchema, on_delete=CASCADE, related_name="levels")
    Level = models.IntegerField()

