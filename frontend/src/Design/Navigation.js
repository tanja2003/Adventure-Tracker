import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

import "bootstrap-icons/font/bootstrap-icons.css";


function Navbar1() {
  return (
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home" style={{fontSize:"30px", marginRight:"25px" }}>Tanja's Abenteur</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link style={{ fontSize: "22px", marginRight:"10px" }} as={Link} to="/">Home</Nav.Link>
            <Nav.Link style={{ fontSize: "22px", marginRight:"10px"  }} as={Link} to="/calender">Kalender</Nav.Link>
            <Nav.Link style={{ fontSize: "22px", marginRight:"10px"  }} as={Link} to="/todo">ToDo's</Nav.Link>
            <NavDropdown
              title={<i className="bi bi-person-circle" style={{ fontSize: "22px" }}></i>}
              align="end"
              id="account-dropdown"
            >
              <NavDropdown.Item as={Link} to="/profile">
                Profil / Einstellungen
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item as={Link} to="/logout">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
  );
}

export default Navbar1;