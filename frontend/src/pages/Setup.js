import React, { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Spinner } from "react-bootstrap";

import ModelSetup from "../components/setup/ModelSetup";
import SetupTrainingParams from "../components/setup/SetupTrainingParams";
import { handleSave, getConfigOptions } from "../scripts/modelSettings";

function Setup(props) {
  const [options, setOptions] = useState({});

  async function getSetOptions() {
    const response = await getConfigOptions();
    setOptions(response);
  }

  useEffect(() => {
    getSetOptions();
  }, []);

  async function handleSaveButton() {
    await handleSave(options);
    getSetOptions();
  }

  if (options.label_class == null) {
    // Not loaded yet
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  } else {
    return (
      <div>
        <div className="row">
          <div className="col-10">
            <h1>Setup Model</h1>
          </div>
          <div className="col-2">
            <div style={{ float: "right" }}>
              <Button onClick={handleSaveButton}>Save</Button>
            </div>
          </div>
        </div>
        <div className="row">
          <p>
            The Machine Learning model can be setup here. Different models with
            different parameters can be used for both <em>class</em> and{" "}
            <em>level</em> predictions. New models can be implemented on the
            server with corresponding parameters defined in the config JSON. The
            models can be changed at any time, automatically training them on
            the labelled data, deleting the previous model.
          </p>
          <p>
            The <em>training parameters</em> control the training behaviour, and
            user interaction.
          </p>
          <ul style={{ paddingLeft: "24px", paddingRight: "24px" }}>
            <li>
              <em>Retrain_rate</em> determines after how many new labelled
              datapoints the server retrains the model.
            </li>

            <li>
              <em>Batch_size</em> determines how many turns are labelled in one
              batch.
            </li>
          </ul>
          <hr />
        </div>
        <Form>
          <div className="row">
            <SetupTrainingParams
              params={options.training_params}
              current={options.current_config}
            />
          </div>
          <hr />
          <div className="row">
            <ModelSetup
              modelFor={options.label_class}
              modelForName="Class"
              current={options.current_config.label_class}
            />
          </div>
          <hr />
          <div className="row">
            <ModelSetup
              modelFor={options.label_levels}
              modelForName="Level"
              current={options.current_config.label_levels}
            />
          </div>
        </Form>
      </div>
    );
  }
}

export default Setup;
