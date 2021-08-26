import tensorflow as tf
from tensorflow import keras
import tensorflow_hub as hub
import tensorflow_text


def compile_bert():
    """
    Code taken from TensorFlow Hub to compile BERT encoder.
    https://tfhub.dev/tensorflow/bert_en_uncased_L-12_H-768_A-12/4
    """
    print(">> Compiling new BERT model from TensorFlow Hub.")
    text_input = keras.layers.Input(shape=(), dtype=tf.string)
    print(">> Downloading Preprocessor Layer")
    preprocessor = hub.KerasLayer(
        "https://tfhub.dev/tensorflow/bert_en_uncased_preprocess/3"
    )(text_input)
    print(">> Downloading BERT Layer")
    encoder = hub.KerasLayer(
        "https://tfhub.dev/tensorflow/bert_en_uncased_L-12_H-768_A-12/4"
    )(preprocessor)
    pooled_output = encoder["pooled_output"]

    embedding_model = keras.Model(text_input, pooled_output)
    print(">> Compiling BERT Model")
    embedding_model.compile()
    return embedding_model

    


