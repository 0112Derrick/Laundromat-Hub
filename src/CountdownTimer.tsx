import React, { useState, useEffect } from "react";
import { Button, Col, Row, Stack } from "react-bootstrap";
import { chosenImage } from "./StartMachine";

export const CountdownTimer = ({
  initialCount,
  completedMSG,
  countdownMSG,
  onTimerFinish,
  isActiveValue,
  updateMachinePhase,
  setDisplayedImage = null,
}) => {
  type ColorCodeNormal = {
    info: {
      color: "cyan";
    };
  };

  type ColorCodeEnd = {
    info: {
      color: "red";
    };
  };
  type ColorCodeWarning = {
    info: {
      color: "yellow";
    };
  };

  type ColorCodes = ColorCodeNormal | ColorCodeEnd | ColorCodeWarning;

  const [count, setCount] = useState(initialCount);
  const [isActive, setIsActive] = useState(isActiveValue);
  const [isFinished, setIsFinished] = useState(false);
  const [remainingPathColor, setRemainingPathColor] = useState<ColorCodes>({
    info: { color: "cyan" },
  });
  const TimeLimit = initialCount;

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
    const reset = () => {
      setIsActive(false);
      setIsFinished(false);
      setCount(initialCount);
    };

    let interval = null;
    if (!isActive && count > 0) {
      setDisplayedImage(chosenImage.image1);
    }

    if (isActive && count > 0) {
      setDisplayedImage(chosenImage.image2);

      interval = setInterval(() => {
        setCount((count) => count - 1);
      }, 1000);

      if (updateMachinePhase) {
        if (count <= 5) {
          setRemainingPathColor({ info: { color: "red" } });
        } else if (count > 5 && count <= TimeLimit / 3) {
          setRemainingPathColor({ info: { color: "yellow" } });
        }
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
      setDisplayedImage(chosenImage.image1);
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
  }, [count, isActive]);

  function formatTimeLeft(time) {
    // The largest round integer less than or equal to the result of time divided being by 60.
    const minutes = Math.floor(time / 60);

    // Seconds are the remainder of the time divided by 60 (modulus operator)
    let seconds: any = time % 60;

    // If the value of seconds is less than 10, then display seconds with a leading zero
    setCircleDasharray();
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    // The output in MM:SS format
    return `${minutes}:${seconds}`;
  }

  function calculateTimeFraction() {
    const t = count / TimeLimit;
    return (1 / count) * -0.08 + t;
  }

  function setCircleDasharray() {
    const FullDashArray = [283, 283];
    const circleElement = document.getElementById("base-timer-path-remaining");

    if (circleElement) {
      const circleDasharray = `${(
        calculateTimeFraction() * FullDashArray.at(0)
      ).toFixed(0)} 283`;

      circleElement.setAttribute("stroke-dasharray", circleDasharray);
    } else {
      console.error("Circle element not found");
    }
  }

  return (
    <Stack gap={4} className="d-flex align-items-center justify-content-center">
      {/* `${countdownMSG}: ${count}` */}
      <h1>{isFinished ? `${completedMSG}` : null}</h1>

      <Row className="d-flex justify-content-center">
        <Col className="d-flex justify-content-center align-items-center">
          <Button
            onClick={() => {
              setIsActive(!isActive);
            }}
          >
            {isActive ? "Pause" : "Start"}
          </Button>
        </Col>
        <Col>
          <div className="base-timer">
            <svg
              className="base-timer__svg"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className="base-timer__circle">
                <circle
                  className="base-timer__path-elapsed"
                  cx="50"
                  cy="50"
                  r="45"
                />
                <path
                  id="base-timer-path-remaining"
                  strokeDasharray="283"
                  className={`base-timer__path-remaining ${remainingPathColor.info.color}`}
                  d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
                ></path>
              </g>
            </svg>
            <span id="base-timer-label" className="base-timer__label">
              {formatTimeLeft(count)}
            </span>
          </div>
        </Col>
      </Row>
    </Stack>
  );
};
