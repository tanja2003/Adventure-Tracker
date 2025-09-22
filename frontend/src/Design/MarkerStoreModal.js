import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

export default function MarkerStoreModal(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("")
    const [picture, setPictures] = useState(null)

    const handleSubmit = async (e) => {
        console.log("in handleSubmit")
        e.preventDefault();

        const formData = new FormData();
        formData.append("image", picture);

        try {
          const res = await fetch("http://localhost:5000/api/markers", {
            method: "POST",
            body: formData, // wichtig: kein JSON.stringify hier!
          });
      
          if (res.ok) {
            console.log("Upload erfolgreich!");
          } else {
            console.error("Fehler:", await res.text());
          }
        } catch (err) {
          console.error("Fehler", err);
        }
    };

    return (
        <div>
            <Modal show={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Neue Reise eintragen</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>*Titel eingeben: </Form.Label>
                            <Form.Control type="text" placeholder="Titel eingeben"
                                value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Beschreibung eingeben: </Form.Label>
                            <Form.Control type="text" placeholder="Beschreibung eingeben"
                                value={description} onChange={(e) => setDescription(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Bilder hochladen:</Form.Label>
                            <Form.Control type="file" accept="image/*" placeholder="Bilder hochladen" 
                                onChange={(e) => setPictures(e.target.files[0])}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => (false)}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" onClick={true}>
                        Speichern
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}