import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";


function Navbar1() {
  return (
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Tanja's Abenteur</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/calender">Kalender</Nav.Link>
            <Nav.Link as={Link} to="/todo">ToDo's</Nav.Link>
            <Nav.Link as={Link} tp="/logout">Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  );
}

export default Navbar1;