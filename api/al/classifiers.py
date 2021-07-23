from os import error
from typing import Type
from sklearn.linear_model import SGDClassifier

def make_sgd(params):
    sgd_defaults = {
        "loss":"hinge",
        "penalty":"l2",
        "alpha":0.0001, 
        "l1_ratio":0.15, 
        "fit_intercept":True, 
        "max_iter":1000,
        "tol":0.001,
        "shuffle":True,
        "verbose":0, 
        "epsilon":0.1,
        "n_jobs":-1,
        "learning_rate":"optimal", 
        "eta0":0.0,
        "power_t":0.5,
        "early_stopping":False, 
        "validation_fraction":0.1, 
        "n_iter_no_change":5, 
        "class_weight":None, 
        "warm_start":False, 
        "average":False
    }
    for param in sgd_defaults:
        if param not in params:
            params[param] = sgd_defaults[param]
    
    clf = SGDClassifier(loss=params["loss"], penalty=params["penalty"],
                        alpha=params["alpha"],l1_ratio=params["l1_ratio"],
                        fit_intercept=params["fit_intercept"],
                        max_iter=params["max_iter"],tol=params["tol"],
                        shuffle=params["shuffle"],verbose=params["verbose"],
                        epsilon=params["epsilon"],n_jobs=params["n_jobs"],
                        learning_rate=params["learning_rate"],
                        eta0=params["eta0"],power_t=params["power_t"],
                        early_stopping=params["early_stopping"],
                        validation_fraction=params["validation_fraction"],
                        n_iter_no_change=params["n_iter_no_change"],
                        class_weight=params["class_weight"],
                        warm_start=params["warm_start"],
                        average=params["average"],)
    return clf


def make_embeddings_model():
    pass


def make_model(model_params):
    if model_params["classifier"] == "SGDClassifier":
        model = make_sgd(model_params["params"])
    else:
        raise TypeError("Model not implemented.")
    
    return model