from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE

# Create your models here.
class CodingSessions(models.Model):
    UserID = models.ForeignKey(User, on_delete=CASCADE)
    SessionName = models.CharField(max_length=100, default="")
    Notes = models.CharField(max_length=500)
    UploadDate = models.DateField(auto_now_add=True)

class Turns(models.Model):
    SessionID = models.ForeignKey(CodingSessions, on_delete=CASCADE)
    Sequence = models.IntegerField(null=False)
    Speaker = models.CharField(max_length=50)
    Speech = models.CharField(max_length=500) # Needs reviewing!

class CodingClasses(models.Model):
    ClassName = models.CharField(max_length=30)
    ClassDescription = models.CharField(max_length=300)

class Codings(models.Model):
    TurnID = models.ForeignKey(Turns, on_delete=CASCADE)
    KnownTrue = models.BooleanField()
