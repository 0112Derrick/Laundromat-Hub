import React, { useState } from "react";
import { Stack, Button, Dropdown, ListGroup } from "react-bootstrap";
import { StartMachine } from "./StartMachine";
import { ProcessPaymentForm, calculateTotal } from "./PaymentProcessor";
import { CycleMode, temps } from "./WashingMachine";

export default function ExpandedWashingMachineView({
  id,
  loadAmount,
  temperature,
  updateWashTemperature,
  temperatures,
  deviceType,
  cycleMode,
  cycleModes,
  setCycleMode,
  machineCost,
  amountRemaining,
  setAmountRemaining,
  doorIsClosed,
  updatePaymentStatus,
  startTimer,
  paymentProcessed,
  setStartTimer,
  calculateWashTime,
  handleTimerFinished,
  inUse,
  setInUse,
  updateDoorStatus,
  washTime,
}) {
  const [displayPaymentScreen, setDisplayPaymentScreen] = useState(false);
  const washingMachineImages = [
    `${process.env.PUBLIC_URL}/washingMachineGIFStill.webp`,
    `${process.env.PUBLIC_URL}/washingMachineGIF.gif`,
  ];

  const updatePaymentScreen = () => {
    setDisplayPaymentScreen((value) => {
      return !value;
    });
  };

  function updateWashTemperatureWrapper(temp: temps) {
    updateWashTemperature(temp);
  }

  function updateCycleModeWrapper(mode: CycleMode) {
    setCycleMode(mode);
  }

  const listTemperatures =
    temperatures && Array.isArray(temperatures)
      ? temperatures.map((temperature: temps, index) => {
          let hrefLink = `#/action-${index}`;
          return (
            <Dropdown.Item
              key={index}
              href={hrefLink}
              onClick={() => {
                updateWashTemperatureWrapper(temperature);
                setTimeout(() => {
                  setAmountRemaining(
                    calculateTotal(
                      deviceType,
                      machineCost,
                      temperature,
                      cycleMode
                    )
                  );
                }, 500);
                console.log(amountRemaining);
              }}
            >
              {temperature.slice(0, 1).toUpperCase() + temperature.slice(1)}
            </Dropdown.Item>
          );
        })
      : null;

  const listCycleModes =
    cycleModes && Array.isArray(cycleModes)
      ? cycleModes.map((cycleMode: CycleMode, index) => {
          let hrefLink = `#/action-${index}`;
          return (
            <Dropdown.Item
              key={index}
              href={hrefLink}
              onClick={() => {
                updateCycleModeWrapper(cycleMode);
                setTimeout(() => {
                  setAmountRemaining(
                    calculateTotal(
                      deviceType,
                      machineCost,
                      temperature,
                      cycleMode
                    )
                  );
                }, 500);
              }}
            >
              {cycleMode.slice(0, 1).toUpperCase() + cycleMode.slice(1)}
            </Dropdown.Item>
          );
        })
      : null;

  return (
    <div style={{ width: "80vw" }}>
      <Stack gap={3}>
        {displayPaymentScreen && doorIsClosed ? (
          <ProcessPaymentForm
            updatePaymentStatus={updatePaymentStatus}
            setDisplayPaymentScreen={setDisplayPaymentScreen}
            settings={{
              machineType: deviceType,
              machineID: id,
              temperatureSetting: temperature,
              cycleMode: cycleMode,
            }}
          />
        ) : (
          <>
            {!(paymentProcessed as boolean) ? (
              <>
                <div>Machine ID: {id}</div>
                <div>
                  {inUse ? (
                    <>
                      <b>Washer:</b> <i> is in use.</i>
                    </>
                  ) : (
                    <>
                      <b>Washer:</b>
                      <i> is available</i>
                    </>
                  )}
                </div>
                <div>
                  This washer holds: <b>{loadAmount} loads</b>
                </div>
                <div>
                  Temperature set to:{" "}
                  <b>
                    {(temperature as string).slice(0, 1).toUpperCase() +
                      (temperature as string).slice(1)}
                  </b>
                </div>
                <div>
                  Cycle mode set to:{" "}
                  <b>
                    {(cycleMode as string).slice(0, 1).toUpperCase() +
                      (cycleMode as string).slice(1)}
                  </b>
                </div>

                <ListGroup as={"ul"}></ListGroup>

                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Wash temperature:
                  </Dropdown.Toggle>

                  <Dropdown.Menu>{listTemperatures}</Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Wash mode:
                  </Dropdown.Toggle>

                  <Dropdown.Menu>{listCycleModes}</Dropdown.Menu>
                </Dropdown>

                <div>
                  Current cost:
                  <b>
                    $
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(amountRemaining)}
                  </b>
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

                <Button
                  onClick={() => {
                    doorIsClosed
                      ? updatePaymentScreen()
                      : alert("Close the door.");
                  }}
                >
                  Complete Transaction
                </Button>

                <div>Complete the payment.</div>
              </>
            ) : (
              <StartMachine
                startTimer={startTimer}
                setStartTimer={setStartTimer}
                onTimerFinish={handleTimerFinished}
                calculateWashTime={calculateWashTime}
                amountRemaining={amountRemaining}
                doorIsClosed={doorIsClosed}
                washTime={washTime}
                setInUse={setInUse}
                displayMachineImages={washingMachineImages}
              />
            )}
          </>
        )}
      </Stack>
    </div>
  );
}
