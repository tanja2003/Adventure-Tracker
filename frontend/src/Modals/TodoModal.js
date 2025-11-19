import { Modal,  Form, Button} from "react-bootstrap"
import { useState } from "react";
import Select from 'react-select';
import { useNavigate } from "react-router-dom";

export default function TodoModal ({show, onClose, onSave})  {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const wheaterOptions = [
      { value: "sunny", label: "Sonniges Wetter"},
      { value: "rainy", label: "Regnerisches Wetter"},
      { value: "both", label: "Immer möglich"},
    ]
    const [wheaterFilter, setWheaterFilter] = useState("both")

     const handleWheaterChange = (option) => {
        setWheaterFilter(option.value)
    }

    const handleSubmit = async (e) => {
    e.preventDefault();

try {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
     },
    body: JSON.stringify({
      title,
      description,
      wheater: wheaterFilter,
    }),
  });

  if (res.status === 401){
    console.warn("Token expired or invalid. Redirecting to login...");
    localStorage.removeItem("token");
    navigate("/login");
    return;
  }

  if (res.ok) {
    const savedTodos = await res.json();
    console.log("Upload erfolgreich!", savedTodos);
    onSave(savedTodos);
    onClose();
  }
  } catch (err) {
    console.error("Fehler beim Speichern:", err);
  }
  }


    return (
        <div>
            <Modal show={show} onHide={onClose} >
                <Modal.Header closeButton>
                  <Modal.Title>Neue TODO hinzufügen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                                <Form.Label>*Titel eingeben: </Form.Label>
                                <Form.Control type="text" placeholder="Titel eingeben" required="True"
                                    value={title} onChange={(e) => setTitle(e.target.value)}/>
                            </Form.Group>
                        <Form.Group className="mb-3">
                                <Form.Label>Beschreibung eingeben: </Form.Label>
                                <Form.Control type="text" placeholder="Beschreibung eingeben"
                                    value={description} onChange={(e) => setDescription(e.target.value)}/>
                            </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Wetterbedingungen eingeben: </Form.Label>
                             <Select
                                  //defaultValue={wheaterOptions[2]}
                                  options={wheaterOptions}
                                  onChange={handleWheaterChange}
                                  placeholder="Wetter Option*"
                                />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>Speichern</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
