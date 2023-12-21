import "./App.css";
import React from "react";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import WashingMachine, { CycleMode, temps } from "./WashingMachine";
import NavBar from "./NavBar";

export interface WashingMachineI {
  id: string;
  cost: number;
  model: string;
  loadAmount: number;
  year: number;
  runTime: number;
  temperatures: Array<temps>;
  cycleModes: Array<CycleMode>;
  deviceType: string;
}

export interface DryerMachineI {
  id: string;
  cost: number;
  model: string;
  loadAmount: number;
  year: number;
  runTime: number;
  temperatures: Array<temps>;
  cycleModes: Array<CycleMode>;
  deviceType: string;
}

interface IndividualWashingMachineProps {
  washingMachines: WashingMachineI[];
}

const fetchWasher = async (id) => {
  const port = 5035;
  const localhost = "http://localhost:";
  const serverIP = "http://192.168.0.229:";
  const route = "/washingmachine/";
  //const request = new Request(`http://localhost:${port}/washingmachine/${id}`
  const request = new Request(`${serverIP + port + route + id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const response = await fetch(request);
    const selectedMachine = await response.json();
    console.log(selectedMachine);
    return selectedMachine;
  } catch (error) {
    console.error(error);
    return null; // Return null in case of an error
  }
};

const IndividualWashingMachine: React.FC<
  IndividualWashingMachineProps
> = () => {
  const { id } = useParams(); // Get the id from the URL params
  const [selectedMachine, setSelectedMachine] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const machine = await fetchWasher(id);
      setSelectedMachine(machine);
    };

    fetchData();
  }, [id]);

  if (!selectedMachine) {
    // Handle the case where the machine with the specified id is not found
    return <div>Machine not found</div>;
  }

  // Render the details of the selected washing machine
  return (
    <WashingMachine
      _id={selectedMachine.id}
      _loadAmount={selectedMachine.loadAmount}
      _washCycleTime={selectedMachine.runTime}
      _machineCost={selectedMachine.cost}
      _model={selectedMachine.model}
      _year={selectedMachine.year}
      _expandedView={true}
      _temperatures={selectedMachine.temperatures}
      _deviceType={selectedMachine.deviceType}
      _cycleModes={selectedMachine.cycleModes}
    ></WashingMachine>
  );
};

const App: React.FC = () => {
  const [washingMachines, setWashingMachines] =
    useState<WashingMachineI[]>(null);

  const port = 5035;

  useEffect(() => {
    const fetchData = async () => {
      const localhost = "http://localhost:";
      const serverIP = "http://192.168.0.229:";
      const route = "/washingmachine/";
      //const request = new Request(`http://localhost:${port}/washingmachine/`
      const request = new Request(`${serverIP + port + route}`, {
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
              <Link to={`/washingmachine/${washer.id}`}>
                <WashingMachine
                  _id={washer.id}
                  _loadAmount={washer.loadAmount}
                  _washCycleTime={washer.runTime}
                  _machineCost={washer.cost}
                  _model={washer.model}
                  _year={washer.year}
                  _expandedView={false}
                  _cycleModes={washer.cycleModes}
                  _temperatures={washer.temperatures}
                  _deviceType={washer.deviceType}
                ></WashingMachine>
              </Link>
            </ListGroupItem>
          );
        })
      : null;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar></NavBar>
              <Container className="bg-dark-subtle homeScreen">
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
            </>
          }
        />
        <Route
          path="/washingmachine/:id"
          element={
            <>
              <NavBar></NavBar>
              <IndividualWashingMachine washingMachines={washingMachines} />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
