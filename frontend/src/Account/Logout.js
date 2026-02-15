import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from "./auth";
import { Button, Card } from 'react-bootstrap';
import { useAuth } from '../Navigation/Authprovider';

export default function LogoutModal ()  {
    const navigate = useNavigate();
    const {logout} = useAuth();

    const confirmLogout = () => {
        logout(navigate("/login"));  
    };

    const cancelLogout = () => {
        navigate("/")
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{marginTop:"80px"}}>
            <Card className="p-4 shadow" style={{ width: "450px"}}>
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Logout</h1>
                <div  style={{ padding:"30px" }}>
                    <p>Bist du sicher, dass du dich abmelden willst?</p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant='success' style={{ marginRight: "auto"}} onClick={confirmLogout}>Ja</Button>
                    <Button variant="danger" style={{ marginLeft: "auto"}}  onClick={cancelLogout}>Nein</Button>
                    </div>                   
                </div>
            </Card>
        </div>
    );
}
