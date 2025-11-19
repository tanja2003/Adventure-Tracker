import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from "./auth";
import { Button } from 'react-bootstrap';

export default function LogoutModal ()  {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const openModal = () => {
        console.log("Ja")
        setIsVisible(true);
    };

    const confirmLogout = () => {
        logout(navigate);  // zentraler Logout
    };

    const cancelLogout = () => {
        setIsVisible(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Logout</h1>
                <div  className="bg-gray-400 items-center p-8 rounded-lg w-full max-w-md shadow-lg" style={{ fontSize:"22px", padding:"60px", marginLeft:"35%", position:"relative", marginRight:"35%", marginTop:"5%"}}>
                    <p>Bist du sicher, dass du dich abmelden willst?</p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button variant='success' style={{ marginRight: "auto"}} onClick={confirmLogout}>Ja</Button>
                    <Button variant="danger" style={{ marginLeft: "auto"}}  onClick={cancelLogout}>Nein</Button>
                    </div>
                    
                </div>

        </div>

    );
}
