import { useState } from "react"
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


export default function Login () {
    const [input, setInput] = useState({email:"", password: ""});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputEmail = (e) => {
        const name = e.target.value;
        setEmail(name);
    }

    const handleInputPassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    }

    const handleRegister = async (e) => {
        navigate("/register");
    }

    const handleSignIn = async (e) => {
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
            navigate("/"); 
          } else {
            console.error(data.error);
          }
        } catch (error) {
            console.error("Something went wrong while sign in a new account!")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">🔐 Login</h1>
       
        <form className="bg-gray-400 p-8 rounded-lg w-full max-w-md shadow-lg"  style={{ fontSize:"24px", padding:"80px", marginLeft:"35%", position:"relative", marginRight:"35%", marginTop:"5%"}}>
            <nav style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "50px" }}>
                <p style={{fontSize:"18px", margin:"0 10px 0 0"}}  className="w-full">Noch keinen Account?</p>
                <Button type="button"  variant="outline-primary" className="w-full" onClick={handleRegister}>
                    Jetzt Registrieren
                </Button>
            </nav>
          {/* E-Mail */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" style={{marginRight:"36px"
            }}>E-Mail: </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              onChange={handleInputEmail}
              aria-invalid="false"
            />
            {errorEmail && (
                <p id="email-help" className="sr-only" style={{fontSize:"15px"}}>
              Bitte eine gültige E-Mail eingeben.
            </p>
            )}
            
          </div>

          {/* Passwort */}
          <div className="flex  space-y-1" style={{marginTop:"20px"}}>
            <label htmlFor="password" style={{marginRight:"10px"}}>Passwort:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="•••••••"
              onChange={handleInputPassword}
              aria-invalid="false"
            />
            {errorPassword && (
            <p id="password-help" className="text-red-600 text-sm mt-1" style={{fontSize:"15px"}}>
                Passwort muss mindestens 6 Zeichen enthalten.
            </p>
            )}

          </div>

          {/* Buttons */}
          <div className="flex  mt-6" style={{marginTop:"30px"}}>
            <Button type="submit"  className="w-full" onClick={handleSignIn}>
              Anmelden
            </Button>
          </div>
          <Button type="button" variant="outline" className="w-full" style={{fontSize:"15px", marginLeft:"-10px", marginTop:"-12px"}}>Passwort vergessen?</Button>

        </form>
    </div>
    )
}