"""altl URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import (default_api, test_api, TranscriptListView, LabellingSchemaListView, 
    TranscriptInstanceView, LabellingSchemaInstanceView,
    UserList, UserDetail, user_login, user_logout,
    get_login_data, change_password, new_labelling_with_levels, edit_labelling_with_levels,
    LabellingSchemaWithLevelsListView, LabellingSchemaWithLevelsInstanceView, 
    LabellingSchemaInstanceEdit, LabellingSchemaWithLevelsListViewAdmin,
    new_transcript, update_transcript_metadata, LabellingBatch, put_labelled_transcript,
    TranscriptDownload, post_model_config, get_model_config)

urlpatterns = [
    path('test/', test_api),
    path('transcripts/', TranscriptListView.as_view()),
    path('transcripts/<int:pk>/', TranscriptInstanceView.as_view()),
    path('label_transcript/<int:pk>/', LabellingBatch.as_view()),
    path('label_transcript_put_labels/', put_labelled_transcript),
    path('labelling_schema/', LabellingSchemaListView.as_view()),
    path('labelling_schema/<int:pk>/', LabellingSchemaInstanceView.as_view()),
    path('labelling_schema_with_levels/', LabellingSchemaWithLevelsListView.as_view()),
    path('labelling_schema_with_levels_admin/', LabellingSchemaWithLevelsListViewAdmin.as_view()),
    path('labelling_schema_with_levels/<int:pk>/', LabellingSchemaWithLevelsInstanceView.as_view()),
    path('labelling_schema_modify/<int:pk>/',LabellingSchemaInstanceEdit.as_view()),
    path('labelling_schema_new/', new_labelling_with_levels),
    path('labelling_schema_edit/', edit_labelling_with_levels),
    path('new_transcript/', new_transcript),
    path('download_transcript/<int:pk>/', TranscriptDownload.as_view()),
    path('update_transcript_metadata/', update_transcript_metadata),
    path('users/', UserList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
    path('auth/', user_login),
    path('auth_logout/', user_logout),
    path('auth_check/', get_login_data),
    path('change_pass/', change_password),
    path('new_model_config/', post_model_config),
    path('get_model_config/', get_model_config),
    path('', default_api)
]

