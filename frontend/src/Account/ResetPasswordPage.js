import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";

export default function ResetPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function submit() {
    const res = await fetch("http://localhost:5000/api/reset/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    console.log(data);
    alert(data.message);
    navigate("/login");
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{marginTop:"80px"}}>
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">🔑 Neues Passwort setzen</h3>
        <Form onSubmit={submit}>
            <Form.Group>
                <Form.Label>Neues Passwort:</Form.Label>
                <Form.Control
                type="password"
                placeholder="•••••••"
                onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>
            <Button style={{marginTop:"20px"}} variant="primary" type="submit" className="w-100">Speichern</Button>
        </Form>
        </Card>
    </div>
  );
}
