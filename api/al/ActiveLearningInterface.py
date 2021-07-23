import json, os
import pickle

import tensorflow as tf
from tensorflow import keras
import tensorflow_hub as hub

from .classifiers import make_model
from .embeddings import compile_bert

MODULE_PATH = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(MODULE_PATH, "al_config.json")
MODELS_PATH = os.path.join(MODULE_PATH, "model")
TRAINING_DATA_PATH = os.path.join(MODELS_PATH, "training_data")

CLASS_MODEL_PATH = os.path.join(MODELS_PATH, "class.model.pickle")
LEVEL_MODEL_PATH = os.path.join(MODELS_PATH, "level.model.pickle")
EMBEDDING_MODEL_PATH = os.path.join(MODELS_PATH, "embeddings.model.h5")


class ActiveLearningInterface:

    def __init__(self):
        if os.path.isfile(CLASS_MODEL_PATH):
            self.load_class_model()
        else:
            self.make_class_model()

        if os.path.isfile(LEVEL_MODEL_PATH):
            self.load_level_model()
        else:
            self.make_level_model()

        if os.path.isfile(EMBEDDING_MODEL_PATH):
            self.load_embeddings_model()
        else:
            self.make_embeddings_model()
        

    def predict(self,turn):
        print(
            tf.constant(
                [turn]
            )
        )
        return {
            "class": 1,
            "level": 1
        }
    
    def train(self, data):
        print(data)
        pass

    def train_now(self):
        # Copy models,
        # Asyncronously train copied models
        # Replace models with async-ly trained models
        pass

    def train_if_possible(self):
        pass

    def make_class_model(self):
        model_config = self.config["label_class"]
        self.class_model =  make_model(model_config)
        self.train_if_possible()
    
    def make_level_model(self):
        model_config = self.config["label_levels"]
        self.level_model =  make_model(model_config)

    
    ###############################################
    # Getters and setters for data stored on disk #
    ###############################################
    def load_embeddings_model(self):
        print("Loading model")
        self.embedding_model = keras.models.load_model(
            EMBEDDING_MODEL_PATH, 
            custom_objects={'KerasLayer':hub.KerasLayer}
            )
        print("############################################\nembeddings loaded\n############################################")


    def make_embeddings_model(self):
        model = compile_bert()
        model.save(EMBEDDING_MODEL_PATH)
        self.embedding_model = model
        print("############################################\nembeddings made\n############################################")
    
    def load_class_model(self):
        with open(CLASS_MODEL_PATH, "rb") as f:
            self.__class_model = pickle.load(f)
    
    @property
    def class_model(self):
        return self.__class_model

    @class_model.setter
    def class_model(self, new_model):
        with open(CLASS_MODEL_PATH, "wb") as f:
            pickle.dump(new_model, f)
        self.__class_model = new_model

    def load_level_model(self):
        with open(LEVEL_MODEL_PATH, "rb") as f:
            self.__level_model = pickle.load(f)

    @property
    def level_model(self):
        return self.__level_model

    @level_model.setter
    def level_model(self, new_model):
        with open(LEVEL_MODEL_PATH, "wb") as f:
            pickle.dump(new_model, f)
        self.__level_model = new_model

    @property
    def config(self):
        with open(CONFIG_PATH) as f:
            config = json.load(f)
        return config

    @config.setter
    def config(self, new_config):
        # Update config data
        with open(CONFIG_PATH) as f:
            json.dump(new_config, f)
        
        # Make new models with new config data
        self.make_class_model()
        self.make_level_model()

        # Train new models
        self.train_now()
        
