
class ActiveLearningInterface:

    def predict(*args, **kwargs):
        return {
            "class": 1,
            "level": 1
        }
    
    def train(self, data):
        pass