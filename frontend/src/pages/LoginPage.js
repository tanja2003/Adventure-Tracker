import { useState } from "react"
import { Button } from "react-bootstrap";


export default function Login () {

    const [input, setInput] = useState({email:"", password: ""});
    const [errorEmail, setErrorEmail] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)
    const handleInput = (e) => {
        const {name, value} = e.value;
        setInput((prev) => ({
            ...prev,
            [name]: value,
    }));}

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{

        } catch (error) {
            console.error("Something went wrong while login!")
        }
    }

    const handleSignIn = async (e) => {
        e.preventDefault();
        try{

        } catch (error) {
            console.error("Something went wrong while sign in a new account!")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">🔐 Login</h1>

        <form onSubmit={handleSubmit}  style={{fontSize:"24px", padding:"40px", marginLeft:"35%", position:"relative", backgroundColor:"#979595ff", marginRight:"35%", marginTop:"5%"}}>
            <div style={{marginBottom:"50px"}}>
                <p style={{fontSize:"18px"}}  className="w-full">Noch keinen Account? Jetzt registrieren.</p>
                <Button type="button"  className="w-full" onClick={handleSignIn}>
                    Registrieren
                </Button>
            </div>
          {/* E-Mail */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" style={{marginRight:"36px"
            }}>E-Mail: </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              onChange={handleInput}
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
              onChange={handleInput}
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
            <Button type="submit"  className="w-full">
              Anmelden
            </Button>
          </div>
          <Button type="button" variant="outline" className="w-full" style={{fontSize:"15px", marginLeft:"-10px", marginTop:"-12px"}}>Passwort vergessen?</Button>

        </form>
    </div>
    )
}