import { useState, useEffect } from "react";
import ExpandedWashingMachineView from "./ExpandedWashingMachineView";
import WashingMachineUI from "./WashingMachineUI";
import { WashingMachineI } from "./App";
import React from "react";
import { Button, Stack } from "react-bootstrap";

type Warm = "warm";
type Cold = "cold";
type Hot = "hot";
export type temps = Warm | Cold | Hot;

export default function WashingMachine({
  _id,
  _loadAmount,
  _machineCost: _cost,
  _washCycleTime,
  _year,
  _model,
  _expandedView,
  _minimize,
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
  const [amountRemaining, setAmountRemaining] = useState(cost);
  const [amountPaid, setAmountPaid] = useState(0.0);
  const [startTimer, setStartTimer] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [expandedView, setExpandedView] = useState(_expandedView || false);
  const loadAmount = _loadAmount;

  

  function changeView() {
    setExpandedView((view) => {
      return !view;
    });

    _minimize(null);
  }

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
    setPaymentProcessed(false);
    // setAmountRemaining(machineCost);
    setStartTimer(false);
    // setAmountPaid(0.0);
    setInUse(false);
  };

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
          <ExpandedWashingMachineView
            changeView={changeView}
            id={id}
            loadAmount={loadAmount}
            temperature={temperature}
            updateWashTemperature={updateWashTemperature}
            machineCost={cost}
            amountRemaining={amountRemaining}
            doorIsClosed={doorIsClosed}
            paymentProcessed={paymentProcessed}
            setPaymentProcessed={setPaymentProcessed}
            startTimer={startTimer}
            setStartTimer={setStartTimer}
            calculateWashTime={calculateWashTime}
            handleTimerFinished={handleTimerFinished}
            inUse={inUse}
            setInUse={setInUse}
            updateDoorStatus={updateDoorStatus}
            washTime={washTime}
          ></ExpandedWashingMachineView>
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
