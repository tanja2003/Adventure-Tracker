import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from "./auth";

const LogoutModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const openModal = () => {
        setIsVisible(true);
    };

    const confirmLogout = () => {
        logout(navigate);  // zentraler Logout
    };

    const cancelLogout = () => {
        setIsVisible(false);
    };

    return (
        <>
            <button onClick={openModal}>Logout</button>

            {isVisible && (
                <div className="modal">
                    <p>Bist du sicher, dass du dich abmelden willst?</p>
                    <button onClick={confirmLogout}>Ja</button>
                    <button onClick={cancelLogout}>Nein</button>
                </div>
            )}
        </>
    );
};

export default LogoutModal;
