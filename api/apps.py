from django.apps import AppConfig
from .al.ActiveLearningModel import ActiveLearningModel as Model

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

class ActiveLearningInterface:
    model = Model()
    embedding = model.transform
    
