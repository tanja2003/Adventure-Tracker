import { useEffect, useState } from "react";
import { logout } from "./auth"; 

const useAutoLogout = (timeout = 300000) => { // 5 minutes
    const [timer, setTimer] = useState(null);

    const resetTimer = () => {
        clearTimeout(timer);
        setTimer(setTimeout(() => logout(), timeout));
    };

    useEffect(() => {
        resetTimer(); 

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
