import React, { useState } from "react";
import { Stack, Button, Dropdown } from "react-bootstrap";
import { StartMachine } from "./StartMachine";
import { ProcessPaymentForm } from "./PaymentProcessor";

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

  return (
    <>
      <div style={{ width: "80vw", height: "100vh", paddingTop: "10%" }}>
        <Stack gap={3}>
          {displayPaymentScreen ? (
            <ProcessPaymentForm
              setPaymentProcessed={setPaymentProcessed}
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
                      updateWashTemperature("Warm");
                    }}
                  >
                    Warm
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="#/action-2"
                    onClick={() => {
                      updateWashTemperature("Hot");
                    }}
                  >
                    Hot
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="#/action-3"
                    onClick={() => {
                      updateWashTemperature("Cold");
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

              {/* <label htmlFor="moneyAmountInput">
            <b>Insert Money:</b>
          </label> */}

              {/* <div>
            <span>$</span>
            <input
              type="number"
              id="moneyAmountInput"
              value={amountPaid}
              onChange={(event) => {
                let payment = Number.parseInt(event.target.value);

                if (payment < 0) {
                  payment = 0;
                }

                if (payment > amountRemaining) {
                  payment = amountRemaining;
                }
                setAmountPaid(payment);
              }}
            />
            <Button
              onClick={() => {
                setAmountPaid((amount) => {
                  if (amount + 1 > amountRemaining) {
                    return amountRemaining;
                  }
                  return amount + 1;
                });
              }}
            >
              +
            </Button>
            <Button
              onClick={() => {
                setAmountPaid((amount) => {
                  if (amount - 1 <= 0.0) {
                    return 0.0;
                  }
                  return amount - 1;
                });
              }}
            >
              -
            </Button>
          </div> */}

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
