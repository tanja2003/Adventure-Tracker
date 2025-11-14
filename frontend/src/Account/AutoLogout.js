import { useEffect, useState } from "react";
import { logout } from "./auth"; // <--- deine zentrale Logout Funktion

const useAutoLogout = (timeout = 300000) => { // 5 Minuten
    const [timer, setTimer] = useState(null);

    const resetTimer = () => {
        clearTimeout(timer);
        setTimer(setTimeout(() => logout(), timeout)); // <-- hier wird dein normales logout() ausgeführt
    };

    useEffect(() => {
        resetTimer(); // Timer direkt starten

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);

        return () => {
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            clearTimeout(timer);
        };
    }, [timer]);

    return null;
};

export default useAutoLogout;
