import React, { useEffect, useState } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

import "bootstrap-icons/font/bootstrap-icons.css";


function Navbar1() {
  const [username, setUsername] = useState("");

  const getNameFromDb = async () => {
    try{
      const token = localStorage.getItem("token");
      console.log("getnamefrom db")
      const res = await fetch('http://localhost:5000/api/register/name', {
        method: "GET",
        headers: { 'Content-Type': 'application/json',
                   "Authorization": `Bearer ${token}`
        },
      })
      if (!res.ok) console.error("Fehler beim holen des Namens");
      const data = await res.json();
      console.log(data);

      const name = Array.isArray(data) && data.length > 0 ? data[0].name : null;
      if (name) {
        setUsername(name);
      } else {
        console.warn("Kein Name gefunden in response", data);
        setUsername(""); // oder Fallback
      }
    } catch (error){
      console.error(error)
    }
  }
  useEffect(() =>{
    getNameFromDb();
  }, []);

  return (
      <Navbar bg="dark" data-bs-theme="dark">
        <Container style={{ marginLeft:"3%"}}>
          <img style={{blockSize:"80px"}} src={`${process.env.PUBLIC_URL}/logo1.jpg`} alt="Logo" />
          <Navbar.Brand href="#home" style={{fontSize:"30px", marginRight:"25px", marginLeft:"20px", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            {username
            ? `${username}'s Abenteuer`
            : "Abenteuer Tracker" }</Navbar.Brand>
          <Nav className="me-auto" style={{marginLeft:"20px"}}>
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