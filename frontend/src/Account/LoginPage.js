import { useState } from "react"
import { Button, Card, Form, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Navigation/Authprovider";


export default function Login () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth();


    const cleanErrorText = () => {
        setErrorEmail(false);
        setErrorPassword(false);
    }

    const handleSignIn = async (e) => {
      cleanErrorText();
      console.log(" in handle sign in")
        e.preventDefault();
        try{
          if (password.length < 6) {
            return
          }
          const res = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
          })
          const data = await res.json();
          if (res.ok) {
            localStorage.setItem("token", data.token); 
            login(data.token);
            navigate("/"); 
          } else {
            console.error(data.error);
            setErrorEmail(true);
            setEmail("");
            setErrorPassword(true);
            setPassword("");
          }
        } catch (error) {
            console.error("Something went wrong while sign in a new account!")
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{marginTop:"80px"}}>
        <Card className="p-4 shadow" style={{ width: "600px"}}>
          <h2 className="text-center mb-3" style={{marginTop:"40px"}}>Login</h2>
       
        <Form style={{ padding:"30px" }} >
            <Nav style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "50px" }}>
                <p style={{fontSize:"18px", margin:"0 10px 0 0"}}  className="w-full">Noch keinen Account?</p>
                <Button type="button"  variant="outline-primary" className="w-full" onClick={() => navigate("/register")}>
                    Jetzt Registrieren
                </Button>
            </Nav>
          {/* E-Mail */}
          <Form.Group className="mb-3">
            <Form.Label>E-Mail-Adresse</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errorEmail && (
                <p id="email-help" className="sr-only" style={{fontSize:"15px"}}>
              Bitte eine gültige E-Mail eingeben.
            </p>
            )}
          </Form.Group> 

          {/* Password */}
          <Form.Group className="mb-3">
            <Form.Label>Passwort</Form.Label>
            <Form.Control
              type="password"
              placeholder="•••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errorPassword && (
                <p id="email-help" className="sr-only" style={{fontSize:"15px"}}>
              Passwort muss mindestens 6 Zeichen enthalten.
            </p>
            )}
          </Form.Group>

          {/* Buttons */}
          <div className="flex  mt-6" style={{marginTop:"40px"}}>
            <Button type="submit"  className="w-full" onClick={handleSignIn}>
              Anmelden
            </Button>
          </div>
          <Button variant="link" onClick={() => navigate("/forgotpassword")}  className="w-full" style={{fontSize:"15px", marginLeft:"-10px"}}>Passwort vergessen?</Button>
        </Form>
        </Card>   
    </div>
    )
}