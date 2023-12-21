import React from "react";
import { Card, Stack } from "react-bootstrap";

export default function WashingMachineUI({
  id,
  loadAmount,
  machineCost: cost,
  model,
  onClick,
  inUse,
}) {
  function changeView() {
    onClick((view) => {
      return !view;
    });
  }

  return (
    <>
      <Card style={{ width: "18rem" }} onClick={changeView}>
        <Card.Img
          variant="top"
          src="https://st.depositphotos.com/1062321/4621/v/950/depositphotos_46217327-stock-illustration-washing-machine-icon.jpg"
        />
        <Card.Body className="washerCardBody">
          <Card.Title>ID: {id}</Card.Title>

          <Stack gap={3}>
            <span> Model: {model}</span>
            <span> Machine Cost: ${cost}</span>
            <span> Load Amount: {loadAmount}</span>
            <span> In use: {inUse ? "true" : "false"}</span>
          </Stack>
        </Card.Body>
      </Card>
    </>
  );
}
