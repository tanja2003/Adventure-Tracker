import { useState } from "react";
import { Button, Form, Toast, ToastContainer, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/forgotpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });


    const data = await res.json();
    console.log("✅ response:", data);

    if (!res.ok) {
      alert(data.error || "Fehler");
      return;
    }
    navigate(`/reset/${data.token}`);

    setShowToast(true);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{marginTop:"80px"}}>
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">🔑 Passwort zurücksetzen</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>E-Mail-Adresse</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            URL zum Zurücksetzen senden
          </Button>
        </Form>
      </Card>

      {/* Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="info"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Passwort-Reset</strong>
          </Toast.Header>
          <Toast.Body>
            Wenn die E-Mail existiert, wurde ein Link gesendet.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
