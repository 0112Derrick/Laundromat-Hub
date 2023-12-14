import { useState, useEffect } from "react";
import ExpandedWashingMachineView from "./ExpandedWashingMachineView";
import WashingMachineUI from "./WashingMachineUI";
import React from "react";
import { Card, Stack } from "react-bootstrap";

type Warm = "warm";
type Cold = "cold";
type Hot = "hot";
export type temps = Warm | Cold | Hot;

type PaymentIncomplete = { name: "paymentProcessed"; status: "false" };
type PaymentCompleted = { name: "paymentProcessed"; status: "true" };
export type PaymentTracker = PaymentCompleted | PaymentIncomplete;

type CycleModeDelicate = "delicate";
type CycleModeNormal = "normal";
type CycleModeQuick = "quick";
type CycleModeSanitary = "sanitary";

export type CycleMode =
  | CycleModeNormal
  | CycleModeDelicate
  | CycleModeQuick
  | CycleModeSanitary;

function Test(props) {
  console.log();
}

export default function WashingMachine({
  _id,
  _loadAmount,
  _machineCost: _cost,
  _washCycleTime,
  _year,
  _model,
  _expandedView,
  _temperatures,
  _deviceType,
  _cycleModes,
}) {
  const cost = _cost;
  const year = _year;
  const model = _model;
  const id = _id;
  const port = 5035;

  const [washTime, setWashTime] = useState(_washCycleTime);
  const [doorIsClosed, setDoorIsClosed] = useState(false);
  const [inUse, setInUse] = useState(false);
  const [temperature, setTemperature] = useState<temps>("warm");
  const [temperatures, setTemperatures] = useState<temps[]>(_temperatures);
  const deviceType = _deviceType;
  const [cycleMode, setCycleMode] = useState<CycleMode>("normal");
  const [cycleModes, setCycleModes] = useState<CycleMode[]>(_cycleModes);
  const [amountRemaining, setAmountRemaining] = useState(cost);
  const [startTimer, setStartTimer] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(
    localStorage.getItem("paymentProcessed") === "true" ? true : false
  );
  const [expandedView, setExpandedView] = useState(_expandedView || false);
  const loadAmount = _loadAmount;

  useEffect(() => {
    if (!startTimer) {
      setWashTime(_washCycleTime);
    }
  }, [startTimer, _washCycleTime]);

  function updateWashTemperature(temp: temps) {
    setTemperature(temp);
  }

  const updateDoorStatus = () => {
    setDoorIsClosed((status) => {
      return !status;
    });
  };

  const handleTimerFinished = () => {
    // setAmountRemaining(machineCost);
    setStartTimer(false);
    // setAmountPaid(0.0);
    setInUse(false);
    updatePaymentStatus({ name: "paymentProcessed", status: "false" });
  };

  function updatePaymentStatus(paymentStatus: PaymentTracker) {
    localStorage.setItem(paymentStatus.name, paymentStatus.status);
    setPaymentProcessed(paymentStatus.status === "true" ? true : false);
  }

  const calculateWashTime = () => {
    //TODO -
    let time = Math.random() + 1;
    console.log(time);
    return time;
  };

  return (
    <>
      <Stack
        gap={3}
        className="d-flex align-items-center justify-content-center"
      >
        {expandedView ? (
          <Card style={{ padding: "12px", margin: "30px" }}>
            <Card.Body>
              <ExpandedWashingMachineView
                id={id}
                loadAmount={loadAmount}
                temperature={temperature}
                temperatures={temperatures}
                deviceType={_deviceType}
                cycleMode={cycleMode}
                cycleModes={cycleModes}
                setCycleMode={setCycleMode}
                updateWashTemperature={updateWashTemperature}
                machineCost={cost}
                amountRemaining={amountRemaining}
                setAmountRemaining={setAmountRemaining}
                doorIsClosed={doorIsClosed}
                updatePaymentStatus={updatePaymentStatus}
                paymentProcessed={paymentProcessed}
                startTimer={startTimer}
                setStartTimer={setStartTimer}
                calculateWashTime={calculateWashTime}
                handleTimerFinished={handleTimerFinished}
                inUse={inUse}
                setInUse={setInUse}
                updateDoorStatus={updateDoorStatus}
                washTime={washTime}
              ></ExpandedWashingMachineView>
            </Card.Body>
          </Card>
        ) : (
          <WashingMachineUI
            id={id}
            loadAmount={loadAmount}
            machineCost={cost}
            model={model}
            inUse={inUse}
            onClick={setExpandedView}
          ></WashingMachineUI>
        )}
      </Stack>
    </>
  );
}
