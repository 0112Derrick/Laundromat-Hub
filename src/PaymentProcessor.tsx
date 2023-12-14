import React, { useEffect, useState } from "react";
import { Form, FormText, Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { DryerMachineI, WashingMachineI } from "./App";
import { temps, CycleMode, PaymentTracker } from "./WashingMachine";

type PaymentInfo = {
  cardHolder: string;
  cvc: string;
  cardNumber: string;
  expirationMonth: number;
  expirationYear: number;
};

type PaymentDetails = {
  paymentDetails: PaymentInfo;
  machineDetails: Settings;
  estimatedCost: number;
};

type WashSettings = {
  machineType: "Washer";
  machineID: string;
  temperatureSetting: temps;
  cycleMode: CycleMode;
};

type DryerSettings = {
  machineType: "Dryer";
  machineID: string;
  temperatureSetting: temps;
  cycleMode: CycleMode;
  dryTime: number;
};

type Settings = WashSettings | DryerSettings;

type PaymentProcessorParams = {
  updatePaymentStatus: (paymentStatus: PaymentTracker) => {};
  setDisplayPaymentScreen: any;
  settings: Settings;
};

type Card = {
  type: "Card";
};

type CVC = {
  type: "CVC";
};

type InputFieldType = Card | CVC;

type InputNumber = {
  type: "number";
};

type InputText = {
  type: "text";
};

type InputPassword = {
  type: "password";
};

type InputEmail = {
  type: "email";
};

type InputType = InputNumber | InputPassword | InputText | InputEmail;

export function calculateTotal(
  machineType: "Washer" | "Dryer",
  cost: number,
  temp: temps,
  cycleMode: CycleMode
): number {
  let totalCost = 0;

  function calcTotal() {
    if (machineType === "Washer") {
      totalCost = cost;
      switch (temp) {
        case "warm":
          totalCost *= 1.0;
          break;
        case "cold":
          totalCost *= 1.0;
          break;
        case "hot":
          totalCost *= 1.2;
          break;
      }

      switch (cycleMode) {
        case "normal":
          totalCost *= 1.0;
          break;
        case "delicate":
          totalCost *= 1.25;
          break;
        case "quick":
          totalCost *= 0.95;
          break;
        case "sanitary":
          totalCost *= 1.5;
          break;
      }
      return totalCost;
    } else {
      //ANCHOR - Code for dyers
      return 0;
    }
  }
  calcTotal();
  return Number.parseFloat(totalCost.toFixed(2));
}

function DisplayPaymentAgreementScreen({
  settings,
  cost,
  setCost,
  washingMachine,
  cardNumber,
  sendPaymentRequest,
}) {
  switch (settings.machineType) {
    case "Washer":
      setCost(
        calculateTotal(
          settings.machineType,
          washingMachine.cost,
          settings.temperatureSetting,
          settings.cycleMode
        )
      );
      break;
    case "Dryer":
      break;
  }

  return (
    <>
      <Alert
        id="paymentResponse"
        key={"paymentResponse"}
        variant="info"
      ></Alert>

      <div>Payment Agreement</div>
      <div>
        Total: $
        {new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(parseFloat(cost.toFixed(2)))}
        ;
      </div>
      <div>
        Do you accept the accept the amount listed above with the card ending in
        ************{cardNumber.slice(-4)}?
      </div>
      <Button
        onClick={() => {
          sendPaymentRequest();
        }}
      >
        Yes
      </Button>
      <Button
        onClick={() => {
          document.getElementById("paymentResponse").innerHTML =
            "Payment was not processed.";

          let count = 5;

          let countdownIntervalId = setInterval(() => {
            document.getElementById(
              "paymentResponse"
            ).innerHTML = `Redirecting in ${count}`;
            count--;
          }, 1000);

          setTimeout(() => {
            clearInterval(countdownIntervalId);
            window.location.href = "http://localhost:3000";
          }, count * 1000 + 100);
        }}
      >
        No
      </Button>
    </>
  );
}

export function ProcessPaymentForm({
  updatePaymentStatus,
  settings,
}: PaymentProcessorParams) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvc, setCVC] = useState("");
  const [expirationMonth, setExpirationMonth] = useState(1);
  const [expirationYear, setExpirationYear] = useState(2023);
  const cardNumberMaxLen = 16;
  const cvcNumberMaxLen = 3;
  const port = 5035;

  const [revealCardNumber, setRevealCardNumber] = useState(true);
  const [revealCVC, setRevealCVC] = useState(true);

  const [washingMachine, setWashingMachine] = useState<WashingMachineI>(null);
  const [dryer, setDryer] = useState(null);

  const [showPaymentAgreementScreen, setShowPaymentAgreementScreen] =
    useState(false);
  const [cost, setCost] = useState<Number>(0);

  useEffect(() => {
    if (settings.machineType === "Washer") {
      const fetchData = async () => {
        const request = new Request(
          `http://localhost:${port}/washingmachine/${settings.machineID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        fetch(request)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setWashingMachine(data);
          })
          .catch((error) => console.error(error));
      };

      fetchData();
    }
  }, [setWashingMachine, settings.machineType, settings.machineID]);

  /**
   *
   * @param cardNumber
   * @returns Boolean
   * @description Checks to see if a debit or credit card is valid
   */
  function isValidCardNumber(cardNumber: string): boolean {
    // Remove spaces and convert to an array of digits
    const cardDigits = cardNumber.replace(/\s/g, "").split("").map(Number);

    // Reverse the array
    cardDigits.reverse();

    // Double every second digit
    for (let i = 1; i < cardDigits.length; i += 2) {
      cardDigits[i] *= 2;

      // If doubling results in a number greater than 9, subtract 9
      if (cardDigits[i] > 9) {
        cardDigits[i] -= 9;
      }
    }

    // Sum all the digits
    const sum = cardDigits.reduce((acc, digit) => acc + digit, 0);

    // The card number is valid if the sum is a multiple of 10
    return sum % 10 === 0;
  }

  /**
   *
   * @param e
   * @param inputFieldType
   * @returns
   */
  function handleCardNumberChange(e, inputFieldType: InputFieldType) {
    // Allow only numeric input
    const inputText = e.target.value.replace(/\D/g, "");
    let formattedInput;
    switch (inputFieldType.type) {
      case "CVC":
        if (inputText.length === cvcNumberMaxLen + 1) {
          return;
        }
        formattedInput = formatCardNumber(inputText, cvcNumberMaxLen);
        setCVC(formattedInput);
        break;
      case "Card":
        if (inputText.length === cardNumberMaxLen + 1) {
          return;
        }
        formattedInput = formatCardNumber(inputText, cardNumberMaxLen);
        setCardNumber(formattedInput);
        break;
    }
    // Format the input as needed (e.g., insert spaces for card number)
  }

  /**
   *
   * @param input
   * @param len
   * @returns
   */
  const formatCardNumber = (input, len: number) => {
    // You can customize the formatting based on your requirements
    const regex = new RegExp(`(\\d{${len}})`, "g");
    const formatted = input.replace(regex, "$1 ").trim();

    return formatted;
  };

  /**
   *
   * @returns
   */

  const sendPaymentRequest = async () => {
    //TODO - Fetch server to make a payment
    //Pop up form to collect user payment information and list payment details.
    // Prevent the browser from reloading the page

    //FIXME - ENCRYPT DATA IN PRODUCTION

    // Read the form data
    const paymentInfo: PaymentInfo = {
      cardNumber: cardNumber,
      cvc: cvc,
      cardHolder: cardHolder,
      expirationMonth: expirationMonth,
      expirationYear: expirationYear,
    };

    const transaction: PaymentDetails = {
      paymentDetails: paymentInfo,
      machineDetails: settings,
      estimatedCost: parseFloat(cost.toFixed(2)),
    };

    if (!isValidCardNumber(paymentInfo.cardNumber)) {
      alert("Invalid card number");
      console.log("Attempted Card number: " + paymentInfo.cardNumber);
      return;
    }

    const formData = JSON.stringify(transaction);

    console.log(formData);

    const request = new Request(`http://localhost:${port}/payment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formData,
    });

    fetch(request)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.message && document.getElementById("paymentResponse")) {
          document.getElementById("paymentResponse").innerHTML = data.message;
        }
        let count = 5;
        let countdownIntervalId = setInterval(() => {
          document.getElementById(
            "paymentResponse"
          ).innerHTML = `Redirecting in ${count}`;
          count--;
        }, 1000);

        setTimeout(() => {
          clearInterval(countdownIntervalId);
          window.location.href = `http://localhost:3000/washingmachine/${settings.machineID}`;
        }, count * 1000 + 100);
      })

      .catch((error) => console.error(error));

    updatePaymentStatus({ name: "paymentProcessed", status: "true" });
  };

  const revealInput = (
    elementId: string,
    elementRevealedType: InputType,
    inputType: InputFieldType
  ) => {
    let inputBox = document.getElementById(elementId) as HTMLInputElement;

    if (!inputBox) {
      alert("Form element doesn't exist");
      return;
    }

    switch (inputType.type) {
      case "CVC":
        console.log("Reveal: " + revealCVC ? "True" : "False");

        setRevealCVC(!revealCVC);

        revealCVC
          ? (inputBox.type = elementRevealedType.type)
          : (inputBox.type = "password");
        break;

      case "Card":
        console.log("Reveal: " + revealCardNumber ? "True" : "False");

        setRevealCardNumber(!revealCardNumber);

        revealCardNumber
          ? (inputBox.type = elementRevealedType.type)
          : (inputBox.type = "password");
        break;
    }
  };

  return (
    <>
      {showPaymentAgreementScreen ? (
        <DisplayPaymentAgreementScreen
          setCost={setCost}
          cardNumber={cardNumber}
          cost={cost}
          sendPaymentRequest={sendPaymentRequest}
          washingMachine={washingMachine}
          settings={settings}
        ></DisplayPaymentAgreementScreen>
      ) : (
        <Form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isValidCardNumber(cardNumber)) {
              alert("Invalid card number");
              document.getElementById("invalidCardNumber").innerHTML =
                "Invalid card number.";
              document.getElementById("invalidCardNumber").style.color = "red";
              console.log("Attempted Card number: " + cardNumber);
              return;
            }
            setShowPaymentAgreementScreen(true);
          }}
        >
          <Form.Group className="mb-3" controlId="formGroupCardHolder">
            <Form.Label>Card Holder Name:</Form.Label>
            <Form.Control
              onChange={(e) => setCardHolder(e.target.value)}
              type="text"
              placeholder="Enter Card Holder Name:"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupPayment">
            <Form.Label>Card number:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Card number:"
              minLength={15}
              maxLength={16}
              inputMode="numeric"
              pattern="[0-9]*"
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e, { type: "Card" })}
            />
            <Form.Text id="invalidCardNumber"></Form.Text>
            <Form.Check
              type={"checkbox"}
              id={`revealCardNumber`}
              label={`Reveal card number`}
              onChange={() => {
                revealInput(
                  "formGroupPayment",
                  { type: "number" },
                  { type: "Card" }
                );
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupCVC">
            <Form.Label>CVC:</Form.Label>
            <Form.Control
              type="password"
              placeholder="CVC:"
              minLength={3}
              maxLength={3}
              value={cvc}
              onChange={(e) => handleCardNumberChange(e, { type: "CVC" })}
            />
            <Form.Text id="cvcInput" muted>
              Check the back of the card for a 3 digit number.
            </Form.Text>
            <Form.Check
              type={"checkbox"}
              id={`revealCVC`}
              label={`Reveal CVC number:`}
              onChange={() => {
                revealInput(
                  "formGroupCVC",
                  { type: "number" },
                  { type: "CVC" }
                );
              }}
            />{" "}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupExpirationMonth">
            <Form.Label>Expiration Month:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Month:"
              minLength={1}
              maxLength={2}
              value={expirationMonth}
              onChange={(e) => {
                if (
                  Number.parseInt(e.target.value) < 1 ||
                  Number.parseInt(e.target.value) > 12
                ) {
                  document.getElementById("expirationMonth").innerHTML =
                    "Enter in a valid month.";
                  document.getElementById("expirationMonth").style.color =
                    "red";
                  return;
                }
                setExpirationMonth(Number.parseInt(e.target.value));
              }}
            />
            <FormText id="expirationMonth"></FormText>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupExpirationYear">
            <Form.Label>Expiration Year:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Year:"
              minLength={4}
              maxLength={4}
              value={expirationYear}
              onChange={(e) => {
                if (expirationYear < 2024 || expirationYear > 2050) {
                  document.getElementById("expirationYear").innerHTML =
                    "Enter in a valid year.";
                  document.getElementById("expirationYear").style.color = "red";
                  setExpirationYear(2024);
                  return;
                }
                setExpirationYear(parseInt(e.target.value));
              }}
            />
            <FormText id="expirationYear"></FormText>
          </Form.Group>

          <Button type="reset">Reset form</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </>
  );
}
