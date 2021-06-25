from django.db.models.query import QuerySet
from rest_framework import serializers
from .models import CodingSessions, Turns, CodingClasses, Codings
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    user_sessions = serializers.PrimaryKeyRelatedField(many=True, queryset=CodingSessions.objects.all())
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'user_sessions')
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, data):
        userdata = {}
        userdata['username'] = data['username']
        userdata['password'] = data['password']
        user = User.objects.create_user(**userdata)
        return user

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