import React, { useEffect, useState } from "react";
import {  Stack } from "react-bootstrap";
import { CountdownTimer } from "./CountdownTimer";


export type RinsePhase = {
  state: "Rinsing";
};

export type SpinPhase = {
  state: "Spinning";
};

export type RestPhase = {
  state: "Resting";
};

export type WashPhase = {
  state: "Washing";
};

export type WashingMachinePhase =
  | RinsePhase
  | SpinPhase
  | RestPhase
  | WashPhase;

export enum chosenImage {
  image1,
  image2,
}

export type displayMachineImages = [image1: string, image2: string];

export function StartMachine({
  startTimer,
  setStartTimer,
  onTimerFinish,
  calculateWashTime,
  amountRemaining,
  doorIsClosed,
  washTime,
  setInUse,
  displayMachineImages = null,
}) {
  const [time, setTime] = useState(washTime);
  const [readyToStartTimer, setReadyToStartTimer] = useState(startTimer);
  const [washPhase, setWashPhase] = useState<WashingMachinePhase>({
    state: "Resting",
  });

  const [displayedImage, setDisplayedImage] = useState(
    displayMachineImages
      ? `${(displayMachineImages as displayMachineImages)[0]}`
      : null
  );

  function setDisplayedImageWrapper(image: 0 | 1) {
    switch (image) {
      case 0:
        setDisplayedImage(
          `${(displayMachineImages as displayMachineImages)[0]}`
        );
        break;
      case 1:
        setDisplayedImage(
          `${(displayMachineImages as displayMachineImages)[1]}`
        );
        break;
    }
  }

  function updateTime() {
    setTime(Math.floor(calculateWashTime() * washTime));
    setReadyToStartTimer(true);
  }

  useEffect(() => {
    if (amountRemaining === 0 && doorIsClosed) {
      setInUse(true);
    }
  }, [setStartTimer, startTimer]);

  return (
    <>
      <Stack
        gap={1}
        className="d-flex align-items-center justify-content-center"
      >
        {/* {readyToStartTimer ? null : <Button onClick={updateTime}>Start</Button>} */}

        {washPhase.state ? <h1>State: {washPhase.state}</h1> : null}

        <CountdownTimer
          initialCount={time}
          isActiveValue={readyToStartTimer}
          completedMSG={"Cycle completed!"}
          countdownMSG={"Minutes remaining"}
          onTimerFinish={onTimerFinish}
          setDisplayedImage={setDisplayedImageWrapper}
          updateMachinePhase={setWashPhase}
        ></CountdownTimer>

        {displayMachineImages ? (
          <img
            src={displayedImage}
            alt="A washing machine."
            style={{ height: "300px", width: "300px" }}
          />
        ) : null}
      </Stack>
    </>
  );
}
