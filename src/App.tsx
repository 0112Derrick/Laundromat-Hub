import "./App.css";
import React from "react";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import WashingMachine from "./WashingMachine";

export interface WashingMachineI {
  id: string;
  cost: number;
  model: string;
  loadAmount: number;
  year: number;
  runTime: number;
}

function App() {
  const [washingMachines, setWashingMachines] =
    useState<WashingMachineI[]>(null);

  const port = 5035;

  useEffect(() => {
    const fetchData = async () => {
      const request = new Request(`http://localhost:${port}/washingmachine/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      fetch(request)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setWashingMachines(data);
        })
        .catch((error) => console.error(error));
    };

    fetchData();
  }, [setWashingMachines]);

  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null
  );

  const handleMachineClick = (machineId: string) => {
    setSelectedMachineId(machineId);
  };

  const listWashers =
    washingMachines && Array.isArray(washingMachines)
      ? washingMachines.map((washer: WashingMachineI) => {
          return (
            <ListGroupItem
              as="li"
              variant="info"
              role="button"
              key={washer.id}
              className="img-thumbnail"
              onClick={() => handleMachineClick(washer.id)}
            >
              <WashingMachine
                _id={washer.id}
                _loadAmount={washer.loadAmount}
                _washCycleTime={washer.runTime}
                _machineCost={washer.cost}
                _model={washer.model}
                _year={washer.year}
                _expandedView={false}
                _minimize={setSelectedMachineId}
              ></WashingMachine>
            </ListGroupItem>
          );
        })
      : null;

  const selectedMachine =
    selectedMachineId !== null
      ? washingMachines.find((machine) => machine.id === selectedMachineId)
      : null;

  return (
    <>
      {selectedMachine ? (
        <WashingMachine
          _id={selectedMachine.id}
          _loadAmount={selectedMachine.loadAmount}
          _washCycleTime={selectedMachine.runTime}
          _machineCost={selectedMachine.cost}
          _model={selectedMachine.model}
          _year={selectedMachine.year}
          _expandedView={true}
          _minimize={setSelectedMachineId}
        ></WashingMachine>
      ) : (
        <Container className="bg-dark-subtle">
          <Row className="justify-content-md-center">
            <Col className="d-flex align-items-center justify-content-center">
              <ListGroup
                as="ul"
                horizontal
                className="flex-wrap gap-2 form-text justify-content-md-center"
              >
                {listWashers}
              </ListGroup>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default App;
