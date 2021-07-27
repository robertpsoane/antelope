import json, os
import pickle

import tensorflow as tf
from tensorflow import keras
import tensorflow_hub as hub

from sklearn.exceptions import NotFittedError

from .classifiers import make_model
from .embeddings import compile_bert

import copy
import time
import threading

MODULE_PATH = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(MODULE_PATH, "al_config.json")
MODELS_PATH = os.path.join(MODULE_PATH, "model")
TRAINING_DATA_PATH = os.path.join(
    os.path.join(MODELS_PATH, "training_data"),
    "training_data.pickle"
)

CLASS_MODEL_PATH = os.path.join(MODELS_PATH, "class.model.pickle")
LEVEL_MODEL_PATH = os.path.join(MODELS_PATH, "level.model.pickle")
EMBEDDING_MODEL_PATH = os.path.join(MODELS_PATH, "embeddings.model.h5")


class ActiveLearningModel:

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

        self.get_n_new()
        
    def transform(self, text):
        return self.embedding_model(tf.constant([text]))

    def predict(self,turn):
        turn_embedding = self.transform(turn)
        try:
            class_prediction = self.class_model.predict(turn_embedding)
            level_prediction = self.level_model.predict(turn_embedding)
        except NotFittedError:
            print(" >> No fitted models.  If this is prior to the first training you can safely ignore this message.  If not this may be an indication that the model has inadvertently been overwritten.")
            class_prediction = 1
            level_prediction = 1

        return {
            "class": class_prediction,
            "level": level_prediction
        }
    
    def train(self, data): 
        new_training_data = [
            {
                "speech": self.transform(instance["speech"])[0],
                "class": int(instance["code"]["class"]),
                "level": int(instance["code"]["level"])
            } for instance in data
        ]
        
        self.save_training_data(new_training_data)
        self.n_new_samples += len(data)

        if self.n_new_samples >= self.retrain_rate:
            self.n_new_samples = 0
            self.train_now()

    def save_training_data(self, new_training_data):
        training_data = self.training_data
        for td in new_training_data:
            training_data["speech"].append(td["speech"])
            training_data["class"].append(td["class"])
            training_data["level"].append(td["level"])
        self.training_data = training_data

    def train_now(self):
        """
        Function to call to train model in background
        """
        threading.Thread(
                target=self.__train_now, name="TEST", daemon=True
            ).start()

    def __train_now(self):
        # Copy models,
        # Asyncronously train copied models
        # Replace models with async-ly trained models
        print(" >> Starting training model")
        training_data = self.training_data
        X = training_data["speech"]
        y_class = training_data["class"]
        y_level = training_data["level"]
        print(" >> Training data loaded")
        self.class_model = self.__train_specific_model_now(
                                self.class_model, X, y_class,"class")
        self.level_model = self.__train_specific_model_now(
                                self.level_model, X, y_level,"level")
        print (f" >> Finished training model")
        
    def __train_specific_model_now(self, model_name, X, y, name):
        print(f" >> Copying {name}")
        model = copy.deepcopy(model_name)
        print(f" >> Fitting {name}")
        model.fit(X, y)
        print(f" >> Fitting {name} complete")
        return model

    def train_if_possible(self):
        training_data = self.training_data
        if len(training_data["speech"]) > 0:
            self.train_now()

    def make_class_model(self):
        model_config = self.config["label_class"]
        self.class_model =  make_model(model_config)
        print(" >> New class model created")
        self.train_if_possible()
    
    def make_level_model(self):
        model_config = self.config["label_levels"]
        self.level_model =  make_model(model_config)
        print(" >> New level model created")
        self.train_if_possible()

    ###############################################
    # Getters and setters for data stored on disk #
    ###############################################
    def get_n_new(self):
        self.__n_new_samples = self.config["n_new"]


    def load_embeddings_model(self):
        print(" >> Loading embeddings model")
        self.embedding_model = keras.models.load_model(
            EMBEDDING_MODEL_PATH, 
            custom_objects={'KerasLayer':hub.KerasLayer}
            )
        print(" >> Embeddings model loaded")


    def make_embeddings_model(self):
        model = compile_bert()
        print(" >> Saving new embeddings model")
        model.save(EMBEDDING_MODEL_PATH)
        self.embedding_model = model
        
    
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
    def n_new_samples(self):
        return self.__n_new_samples

    @n_new_samples.setter
    def n_new_samples(self, n):
        self.__n_new_samples = n
        config = self.config
        config["n_new"] = n

        self.__save_config_json(config)
        

    @property
    def retrain_rate(self):
        return self.__retrain_rate

    @retrain_rate.setter
    def retrain_rate(self, rate):
        self.__retrain_rate = rate
    
    @property
    def config(self):
        with open(CONFIG_PATH) as f:
            config = json.load(f)
        self.retrain_rate = config["retrain_rate"]
        return config

    @config.setter
    def config(self, new_config):
        self.retrain_rate = new_config["retrain_rate"]
        
        self.__save_config_json(new_config)
        
        # Make new models with new config data
        self.make_class_model()
        self.make_level_model()

    def __save_config_json(self, config):
        # Update config data
        with open(CONFIG_PATH, "w") as f:
            json.dump(config, f)

    @property
    def training_data(self):
        if os.path.isfile(TRAINING_DATA_PATH):
            with open(TRAINING_DATA_PATH, "rb") as f:
                training_data = pickle.load(f)
        else:
            training_data = {
                "speech": [],
                "class" : [],
                "level" : []
            }
        return training_data

    @training_data.setter
    def training_data(self, new_training_data):
        with open(TRAINING_DATA_PATH, "wb") as f:
                pickle.dump(new_training_data, f)
        
        
