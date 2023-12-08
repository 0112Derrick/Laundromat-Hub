import React, { useState } from "react";
import { Stack, Button, Dropdown } from "react-bootstrap";
import { StartMachine } from "./StartMachine";
import { ProcessPaymentForm } from "./PaymentProcessor";
import { temps } from "./WashingMachine";

export default function ExpandedWashingMachineView({
  changeView,
  id,
  loadAmount,
  temperature,
  updateWashTemperature,
  machineCost,
  amountRemaining,
  doorIsClosed,
  paymentProcessed,
  startTimer,
  setPaymentProcessed,
  setStartTimer,
  calculateWashTime,
  handleTimerFinished,
  inUse,
  setInUse,
  updateDoorStatus,
  washTime,
}) {
  const [displayPaymentScreen, setDisplayPaymentScreen] = useState(false);
  const updatePaymentScreen = () => {
    setDisplayPaymentScreen((value) => {
      return !value;
    });
  };

  function updateWashTemperatureWrapper(temp: temps) {
    updateWashTemperature(temp);
  }

  return (
    <>
      <div style={{ width: "80vw", height: "100vh", paddingTop: "10%" }}>
        <Stack gap={3}>
          {displayPaymentScreen ? (
            <ProcessPaymentForm
              setPaymentProcessed={setPaymentProcessed}
              setDisplayPaymentScreen={setDisplayPaymentScreen}
              settings={{
                machineType: "Washer",
                machineID: id,
                temperatureSetting: temperature,
                washMode: "normal",
              }}
            ></ProcessPaymentForm>
          ) : (
            <>
              <Button onClick={changeView}>Minimize</Button>
              <div>Machine ID: {id}</div>
              <div>
                {inUse ? (
                  <>
                    {" "}
                    <b>Washer:</b> <i> is in use.</i>
                  </>
                ) : (
                  <>
                    {" "}
                    <b>Washer:</b>
                    <i> is available</i>
                  </>
                )}
              </div>
              <div>This washer holds: {loadAmount} loads</div>
              <div>Temperature set to: {temperature}</div>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Wash temperature
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    href="#/action-1"
                    onClick={() => {
                      updateWashTemperatureWrapper("warm");
                    }}
                  >
                    Warm
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="#/action-2"
                    onClick={() => {
                      updateWashTemperatureWrapper("hot");
                    }}
                  >
                    Hot
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="#/action-3"
                    onClick={() => {
                      updateWashTemperatureWrapper("cold");
                    }}
                  >
                    Cold
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <div>Machine cost: ${machineCost}</div>

              <div>
                Remaining amount needed to start the machine:{" "}
                <b>${amountRemaining}</b>
              </div>

              <div>
                <b>Door status</b>:
                {doorIsClosed ? (
                  <i> "Door is closed"</i>
                ) : (
                  <i> "Door is open. Please close the door."</i>
                )}
              </div>

              <Button onClick={updateDoorStatus}>
                {doorIsClosed ? (
                  <div>Open the door</div>
                ) : (
                  <div>Close the door</div>
                )}
              </Button>

              {paymentProcessed ? (
                <StartMachine
                  startTimer={startTimer}
                  setStartTimer={setStartTimer}
                  onTimerFinish={handleTimerFinished}
                  calculateWashTime={calculateWashTime}
                  amountRemaining={amountRemaining}
                  doorIsClosed={doorIsClosed}
                  washTime={washTime}
                  setInUse={setInUse}
                ></StartMachine>
              ) : (
                <>
                  <Button onClick={updatePaymentScreen}>
                    Complete Transaction
                  </Button>

                  <div>Complete the payment.</div>
                </>
              )}
            </>
          )}
        </Stack>
      </div>
    </>
  );
}
