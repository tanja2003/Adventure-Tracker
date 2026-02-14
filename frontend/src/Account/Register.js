import { Check, Icon, Regex } from "lucide-react";
import { useState } from "react";
import { Button, Card, Form, ToggleButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BackButton from "../Design/BackButton";
import DatenschutzCheckbox from "../Design/Datenschutz";


export default function Register(){
    const [name, setName] = useState("");
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

    const handleInputName = (e) => {
        const name = e.target.value;
        setName(name);
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
                body: JSON.stringify({name, email, password})
            });
            const data = await res.json();
            localStorage.setItem("token", data.token);
            navigate("/");


        } catch (error){
            console.error("Something went wrong while register a new acount!")
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{marginTop:"80px"}} >
            <Card className="p-4 shadow" style={{ width: "600px"}}>
                <div style={{display:"flex", alignItems:"center"}}>
                    <BackButton />
                    <h2 className="text-center mb-3" style={{marginLeft:"100px"}}>Register</h2>   
                </div>
                
              <Form style={{padding:"30px"}}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name: </Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="Max Mustermann"
                            value={name}
                            onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>E-Mail:</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required/>
                        {errorEmail && (
                            <p id="email-help" className="sr-only" style={{fontSize:"15px", color:"red"}}>Ungültige E-Mail-Addresse!</p>
                        )}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Passwort:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="•••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required/>
                        {errorPassword && (
                            <p id="password-help" className="sr-only" style={{fontSize:"15px", color:"red"}}>Ungültiges Passwort! </p>
                        )}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Wiederholen:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="•••••••"
                            value={password_again}
                            onChange={(e) => setPasswordAgain(e.target.value)}
                            required/>
                        {errorPasswordAgain && (
                            <p id="password-again-help" className="sr-only" style={{fontSize:"15px", color:"red"}}>Nicht dasselbe Passwort! </p>
                        )}
                    </Form.Group>
                     <DatenschutzCheckbox onChange={setAgreed}/>
                    <Button disabled={!agreed} onClick={handleSignIn}>Registrieren</Button>       
              </Form>
            </Card>
        </div>
    )
}