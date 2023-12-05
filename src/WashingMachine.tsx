import { useState, useEffect } from "react";
import ExpandedWashingMachineView from "./ExpandedWashingMachineView";
import WashingMachineUI from "./WashingMachineUI";
import { WashingMachineI } from "./App";
import React from "react";
import { Button, Stack } from "react-bootstrap";


export async function fetchWashingMachines(): Promise<WashingMachineI[]> {
  try {
    const response = await fetch("/washingMachines.json"); // assuming it's in the public folder
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching washing machines:", error);
    return null;
  }
}

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
  const runCost = _cost;
  const machineCost = runCost * 5;
  const year = _year;
  const model = _model;
  const id = _id;
  const port = 5035;

  const [washTime, setWashTime] = useState(_washCycleTime);
  const [doorIsClosed, setDoorIsClosed] = useState(false);
  const [inUse, setInUse] = useState(false);
  const [temperature, setTemperature] = useState("Warm");
  const [amountRemaining, setAmountRemaining] = useState(machineCost);
  const [amountPaid, setAmountPaid] = useState(0.0);
  const [startTimer, setStartTimer] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [expandedView, setExpandedView] = useState(_expandedView || false);
  const loadAmount = _loadAmount;

  // const [numb1, setNumb1] = useState(0);
  // const [numb2, setNumb2] = useState(0);

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

  function updateWashTemperature(temp) {
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

  // const mathApiAdd = () => {
  //   const request = new Request(`http://localhost:${port}/add`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       numb1: numb1,
  //       numb2: numb2,
  //     }),
  //   });

  //   fetch(request)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((error) => console.error(error));
  // };

  // const mathApiMultiply = () => {
  //   const request = new Request(`http://localhost:${port}/multiply`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       numb1: numb1,
  //       numb2: numb2,
  //     }),
  //   });

  //   fetch(request)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((error) => console.error(error));
  // };

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
            machineCost={machineCost}
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
            machineCost={machineCost}
            model={model}
            inUse={inUse}
            onClick={setExpandedView}
          ></WashingMachineUI>
        )}
      </Stack>
    </>
  );
}
