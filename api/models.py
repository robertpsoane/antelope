from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE

# Create your models here.
class CodingSessions(models.Model):
    UserID = models.ForeignKey(User, on_delete=CASCADE, related_name="user_sessions")
    SessionName = models.CharField(max_length=100, default="")
    Notes = models.CharField(max_length=1000)
    UploadDate = models.DateField(auto_now_add=True)

class Turns(models.Model):
    SessionID = models.ForeignKey(CodingSessions, on_delete=CASCADE)
    Sequence = models.IntegerField(null=False)
    Speaker = models.CharField(max_length=50)
    Speech = models.CharField(max_length=1000) # Needs reviewing!

class CodingSchema(models.Model):
    ClassName = models.CharField(max_length=30)
    ClassShort = models.CharField(max_length=3, null=True)
    ClassDescription = models.CharField(max_length=1000)

class CodingSchemaLevels(models.Model):
    Coding = models.ForeignKey(CodingSchema, on_delete=CASCADE, related_name="levels")
    Level = models.IntegerField()

class Codings(models.Model):
    TurnID = models.ForeignKey(Turns, on_delete=CASCADE)
    Coding = models.ForeignKey(CodingSchema, on_delete=CASCADE)
    Level = models.ForeignKey(CodingSchemaLevels, on_delete=CASCADE)
    KnownTrue = models.BooleanField()
