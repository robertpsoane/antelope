from django.db.models.query import QuerySet
from rest_framework import serializers
from .models import Transcripts, LabellingSchema, LabellingSchemaLevels
from django.contrib.auth.models import User

import json

class UserSerializer(serializers.ModelSerializer):
    user_transcripts = serializers.PrimaryKeyRelatedField(many=True, queryset=Transcripts.objects.all())
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'user_transcripts')
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, data):
        userdata = {}
        userdata['username'] = data['username']
        userdata['password'] = data['password']
        user = User.objects.create_user(**userdata)
        return user

class TranscriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcripts
        fields = ('id', 'UserID', 'TranscriptName', 'Notes', 'TranscriptLocation', 'NextLabelling', 'NTurns', 'UploadDate', 'UploadTime', 'UploadDateTime')

class LabellingSchemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabellingSchema
        fields = ('id', 'ClassName', 'ClassDescription')

class LabellingSchemaWithLevels(serializers.ModelSerializer):
    levels = serializers.SlugRelatedField(many=True, queryset=LabellingSchemaLevels, slug_field="Level")
    class Meta:
        model = LabellingSchema
        fields = ('id', 'ClassName', 'ClassShort', 'ClassDescription', 'levels')

class LabellingSchemaLevelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabellingSchemaLevels
        fields = ('id', 'Labelling', 'Level')