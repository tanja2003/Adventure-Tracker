import { Check, Icon, Regex } from "lucide-react";
import { useState } from "react";
import { Button, ToggleButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BackButton from "../Design/BackButton";
import DatenschutzCheckbox from "../Design/Datenschutz";


export default function Register(){
    const [password, setPassword] = useState("");
    const [password_again, setPasswordAgain] = useState("");
    const [email, setEmail] = useState("");
    const strictEmailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorPasswordAgain, setErrorPasswordAgain] = useState(false);
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);

    const cleanErrorText = () => {
        setErrorEmail(false);
        setErrorPassword(false);
        setErrorPasswordAgain(false);
    }
    const handleInputEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    }

    const handleInputPassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    }

    const handleInputPasswordAgain = (e) => {
        const password_again =e.target.value;
        setPasswordAgain(password_again);
    }

    const validateData = () => {
        cleanErrorText();
        const error = false;
        if (email.length < 5 || !strictEmailRegex.test(email)){
            setErrorEmail(true);
            setEmail("");
            error = true;
        }
        if (password.length < 6 ){
            setErrorPassword(true);
            setPassword("");
            setPasswordAgain("");
            error = true;
        }
        if (password != password_again){
            setErrorPasswordAgain(true);
            setPassword("");
            setPasswordAgain("");
            error = true;
        }
        console.log("error", error);
        return error;
    }

    const handleSignIn = async (e) => {
        e.preventDefault();
        try{
            if (validateData()) return;
            const res = await fetch('http://localhost:5000/api/register', {
                method: "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });
            const data = await res.json();
            
                localStorage.setItem("token", data.token);
       
            navigate("/");


        } catch (error){
            console.error("Something went wrong while register a new acount!")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50" >
            <div style={{ fontSize:"24px", padding:"40px", marginLeft:"35%", position:"relative", backgroundColor:"#979595ff", marginRight:"35%", marginTop:"5%"}}>
                 <div style={{display:"flex", marginBottom:"30px"}}>
                    <BackButton />
                 <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Registrierung</h1>
                 </div>
                 
            <div className="flex flex-col space-y-1">
                <label htmlFor="email-register" style={{marginRight:"36px"}}>E-Mail</label>
                <input type="email"
                    id="email-register"
                    name="email-register"
                    placeholder="example@gmail.com"
                    onChange={handleInputEmail}
                    aria-invalid="false"
                    required></input>
                {errorEmail && (
                    <p id="email-help" className="sr-only" style={{fontSize:"15px", color:"red"}}>Ungültige E-Mail-Addresse!</p>
                )}
            </div>
            <div className="flex  space-y-1" style={{marginTop:"20px"}}>
                <label htmlFor="password-register" style={{marginRight:"10px"}}>Passwort</label>
                <input type="password"
                    id="password-register"
                    name="password-register"
                    onChange={handleInputPassword}
                    aria-invalid="false"
                    required></input>
                {errorPassword && (
                    <p id="password-help" className="sr-only" style={{fontSize:"15px", color:"red"}}>Ungültiges Passwort</p>
                )}
            </div>
            <div className="flex  space-y-1" style={{marginTop:"20px"}}>
                <label htmlFor="password_again" style={{marginRight:"10px"}}>Passwort wiederholen</label>
                <input type="password"
                    id="password_again"
                    name="password_again"
                    onChange={handleInputPasswordAgain}
                    aria-invalid="false"
                    required></input>
                {errorPasswordAgain && (
                    <p id="password_again-help" className="sr-only" style={{fontSize:"15px", color:"red"}}>Nicht dasselbe Passwort</p>
                )}
            </div>
             <DatenschutzCheckbox onChange={setAgreed} />
            <Button disabled={!agreed} onClick={handleSignIn}>Registrieren</Button>
            </div>
        </div>
    )
}