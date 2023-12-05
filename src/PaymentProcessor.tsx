import { Console } from "console";
import { type } from "os";
import React, { useState } from "react";
import { Form, Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export function ProcessPaymentForm({ setPaymentProcessed }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvc, setCVC] = useState("");
  const cardNumberMaxLen = 16;
  const cvcNumberMaxLen = 3;

  const [revealCardNumber, setRevealCardNumber] = useState(true);
  const [revealCVC, setRevealCVC] = useState(true);

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

  const sendPaymentRequest = async (e) => {
    //TODO - Fetch server to make a payment
    //Pop up form to collect user payment information and list payment details.
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = {
      cardNumber: cardNumber,
      cvcNumber: cvc,
      cardHolder: cardHolder,
    };

    const formData = JSON.stringify(form);

    console.log(formData);

    // You can pass formData as a fetch body directly:
    // const response = await fetch("/some-api", {
    //   method: form.method,
    //   body: formData,
    // });

    // const data = await response.json();
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
      <Form method="post" onSubmit={sendPaymentRequest}>
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
              revealInput("formGroupCVC", { type: "number" }, { type: "CVC" });
            }}
          />
        </Form.Group>

        <Button type="reset">Reset form</Button>
        <Button type="submit">Submit</Button>
      </Form>
    </>
  );
}
