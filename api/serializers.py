from rest_framework import serializers
from .models import CodingSessions, Turns, CodingClasses, Codings


class CodingSessionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodingSessions
        fields = ('id', 'UserID', 'SessionName', 'Notes', 'UploadDate')

class TurnsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turns
        fields = ('id', 'SessionID', 'Sequence', 'Speaker', 'Speech')

class CodingClassesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodingClasses
        fields = ('id', 'ClassName', 'ClassDescription')

class CodingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Codings
        fields = ('id', 'TurnID', 'KnownTrue')