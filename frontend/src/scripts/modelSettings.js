import Cookies from "universal-cookie";

export function handleSave(options) {
  const new_config = {
    label_class: getModelParameters("Class", "class", options),
    label_levels: getModelParameters("Level", "levels", options),
  };
  // Add traiing params to new config
  Object.keys(options.training_params).map((param, _) => {
    var param_id = "training_params_" + param;
    var param_val = document.getElementById(param_id).value;
    param_val = checkParseFloat(param_val, options.training_params, param);
    new_config[param] = param_val;
  });
  const response = sendNewConfig(new_config);
}

async function sendNewConfig(config) {
  const cookies = new Cookies();

  const response = await fetch("/api/new_model_config/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    credentials: "same-origin",
    body: JSON.stringify(config),
  }).then(
    // Converting AJAX response to json
    (response) => response.json()
  );
  return response;
}

export async function getConfigOptions() {
  const cookies = new Cookies();
  const response = await fetch("/api/get_model_config/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    credentials: "same-origin",
  }).then(
    // Converting AJAX response to json
    (response) => response.json()
  );

  return response;
}

function getModelParameters(upper, lower, options) {
  const modelParams = {
    params: {},
  };

  // Getting Model Input Name
  const classClassifier = document.getElementById(
    upper + "_choose_model"
  ).value;
  modelParams.classifier = classClassifier;

  // For each parameter, get parameter and add to dictionary
  Object.keys(options["label_" + lower].classifiers[classClassifier]).map(
    (param, _) => {
      var param_id = upper + "_" + param;
      var param_val = document.getElementById(param_id).value;

      param_val = checkParseFloat(
        param_val,
        options["label_" + lower].classifiers[classClassifier],
        param
      );
      modelParams.params[param] = param_val;
    }
  );

  return modelParams;
}

function checkParseFloat(val, obj, key) {
  if (obj[key].type == "float") {
    return parseFloat(val);
  } else {
    return val;
  }
}
