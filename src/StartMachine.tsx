import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { CountdownTimer } from "./CountdownTimer";
import exp from "constants";

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

export function StartMachine({
  startTimer,
  setStartTimer,
  onTimerFinish,
  calculateWashTime,
  amountRemaining,
  doorIsClosed,
  washTime,
  setInUse,
}) {
  const [time, setTime] = useState(washTime);
  const [readyToStartTimer, setReadyToStartTimer] = useState(startTimer);
  const [washPhase, setWashPhase] = useState<WashingMachinePhase>({
    state: "Resting",
  });

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
      {amountRemaining === 0 && doorIsClosed ? (
        <>
          {readyToStartTimer ? null : (
            <Button onClick={updateTime}>Start</Button>
          )}

          {washPhase.state ? <div>State: {washPhase.state}</div> : null}

          <CountdownTimer
            initialCount={time}
            isActiveValue={readyToStartTimer}
            completedMSG={"Cycle completed!"}
            countdownMSG={"Minutes remaining"}
            onTimerFinish={onTimerFinish}
            updateMachinePhase={setWashPhase}
          ></CountdownTimer>
        </>
      ) : (
        <div>Close the door.</div>
      )}
    </>
  );
}
