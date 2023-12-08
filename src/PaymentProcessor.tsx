import { Console } from "console";
import { type } from "os";
import React, { useEffect, useState } from "react";
import { Form, Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { WashingMachineI } from "./App";
import { temps } from "./WashingMachine";

type PaymentInfo = {
  cardHolder: string;
  cvc: string;
  cardNumber: string;
};

type PaymentDetails = {
  paymentInfo: PaymentInfo;
  machineDetails: Settings;
};

type CycleModeDelicate = "delicate";
type CycleModeNormal = "normal";
type CycleModeQuick = "quick";
type CycleModeSanitary = "sanitary";

type CycleMode =
  | CycleModeNormal
  | CycleModeDelicate
  | CycleModeQuick
  | CycleModeSanitary;

type WashSettings = {
  machineType: "Washer";
  machineID: string;
  temperatureSetting: string;
  washMode: CycleMode;
};

type DryerSettings = {
  machineType: "Dryer";
  machineID: string;
  temperatureSetting: string;
  dryerMode: CycleMode;
  dryTime: number;
};

type Settings = WashSettings | DryerSettings;

type PaymentProcessorParams = {
  setPaymentProcessed: any;
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

export function ProcessPaymentForm({
  setPaymentProcessed,
  settings,
}: PaymentProcessorParams) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvc, setCVC] = useState("");
  const cardNumberMaxLen = 16;
  const cvcNumberMaxLen = 3;
  const port = 5035;

  const [revealCardNumber, setRevealCardNumber] = useState(true);
  const [revealCVC, setRevealCVC] = useState(true);
  const [washingMachine, setWashingMachine] = useState<WashingMachineI>(null);
  const [showPaymentAgreementScreen, setShowPaymentAgreementScreen] =
    useState(false);

  useEffect(() => {
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
  }, [setWashingMachine]);

  function isValidCardNumber(cardNumber) {
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

  function handleCardNumberChange(e, inputFieldType: InputFieldType) {
    // Allow only numeric input
    const inputText = e.target.value.replace(/\D/g, "");
    let formattedInput;
    switch (inputFieldType.type) {
      case "CVC":
        if (inputText.length == cvcNumberMaxLen + 1) {
          return;
        }
        formattedInput = formatCardNumber(inputText, cvcNumberMaxLen);
        setCVC(formattedInput);
        break;
      case "Card":
        if (inputText.length == cardNumberMaxLen + 1) {
          return;
        }
        formattedInput = formatCardNumber(inputText, cardNumberMaxLen);
        setCardNumber(formattedInput);
        break;
    }
    // Format the input as needed (e.g., insert spaces for card number)
  }

  const formatCardNumber = (input, len: number) => {
    // You can customize the formatting based on your requirements
    const regex = new RegExp(`(\\d{${len}})`, "g");
    const formatted = input.replace(regex, "$1 ").trim();

    return formatted;
  };

  const DisplayPaymentAgreementScreen = () => {
    const [totalCost, setTotalCost] = useState(0.0);

    useEffect(() => {
       function calculateTotal() {
         if (settings.machineType == "Washer") {
           setTotalCost(washingMachine.cost);
           switch (settings.temperatureSetting as temps) {
             case "warm":
               setTotalCost((cost) => {
                 return (cost *= 1.0);
               });
               break;
             case "cold":
               setTotalCost((cost) => {
                 return (cost *= 1.0);
               });

               break;
             case "hot":
               setTotalCost((cost) => {
                 return (cost *= 1.2);
               });
               break;
           }

           switch (settings.washMode) {
             case "normal":
               setTotalCost((cost) => {
                 return (cost *= 1.0);
               });
               break;
             case "delicate":
               setTotalCost((cost) => {
                 return (cost *= 1.25);
               });
               break;
             case "quick":
               setTotalCost((cost) => {
                 return (cost *= 1.2);
               });
               break;
             case "sanitary":
               setTotalCost((cost) => {
                 return (cost *= 1.5);
               });
               break;
           }
           return;
         } else {
           //ANCHOR - Code for dyers
           return;
         }
       }
       calculateTotal();
    },[totalCost])
   

    return (
      <>
        <div>Payment Agreement</div>
        <div>Total: ${totalCost.toFixed(2)}</div>
        <div>
          Do you accept the accept the amount listed above with the card ending
          in ************{cardNumber.slice(-4)}?
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
            window.location.href = "http://localhost:3000";
          }}
        >
          No
        </Button>
      </>
    );
  };

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
    };

    isValidCardNumber(paymentInfo.cardNumber)
      ? console.log("true")
      : console.log("false");

    const formData = JSON.stringify(paymentInfo);

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
      })
      .catch((error) => console.error(error));

    //setAmountRemaining(0.0);
    setPaymentProcessed(true);
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
        <DisplayPaymentAgreementScreen></DisplayPaymentAgreementScreen>
      ) : (
        <Form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
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
            />
          </Form.Group>

          <Button type="reset">Reset form</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </>
  );
}
