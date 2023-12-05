import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { WashingMachinePhase } from "./StartMachine";

export const CountdownTimer = ({
  initialCount,
  completedMSG,
  countdownMSG,
  onTimerFinish,
  isActiveValue,
  updateMachinePhase,
}) => {
  const [count, setCount] = useState(initialCount);
  const [isActive, setIsActive] = useState(isActiveValue);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setCount(() => {
      return initialCount;
    });
  }, [initialCount]);

  useEffect(() => {
    setIsActive(() => {
      return isActiveValue;
    });
  }, [isActiveValue]);

  useEffect(() => {
    let interval = null;

    if (isActive && count > 0) {
      interval = setInterval(() => {
        setCount((count) => count - 1);
      }, 1000);
      if (updateMachinePhase) {
        if ((count >= 0 && count < 5) || (count >= 10 && count < 15)) {
          updateMachinePhase({ state: "Resting" });
        } else if ((count >= 5 && count < 10) || (count >= 15 && count < 20)) {
          updateMachinePhase({ state: "Spinning" });
        } else if (count >= initialCount - 5 || (count >= 20 && count < 25)) {
          updateMachinePhase({ state: "Rinsing" });
        } else {
          updateMachinePhase({ state: "Washing" });
        }
      }
    } else if (isActive && count === 0) {
      setIsFinished(true);
      setIsActive(false);
      if (onTimerFinish) {
        onTimerFinish();
      }
      reset();
    } else if (!isActive && count !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, count]);

  const reset = () => {
    setIsActive(false);
    setIsFinished(false);
    setCount(initialCount);
  };

  return (
    <div>
      <div>{isFinished ? `${completedMSG}` : `${countdownMSG}: ${count}`}</div>
      {isActive ? (
        <Button onClick={() => setIsActive(!isActive)}>
          {isActive ? "Pause" : "Start"}
        </Button>
      ) : null}
    </div>
  );
};
