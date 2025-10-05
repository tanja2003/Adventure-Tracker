import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

export default function MarkerStoreModal  ({show, onClose, lat, lng, onSave}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [picture, setPictures] = useState(null);
    const [showModal, setShowModal] = useState(true);

    const handleSubmit = async (e) => {
        console.log("in handleSubmit")
        e.preventDefault();

        const formData = new FormData();
        
        formData.append("title", title)
        formData.append("image", picture);
        formData.append("description", description);
        formData.append("lat", lat);
        formData.append("lng", lng);
        console.log("formData: ", formData)
        try {
          const res = await fetch("http://localhost:5000/api/markers", {
            method: "POST",
            body: formData, // wichtig: kein JSON.stringify hier!
          });
      
          if (res.ok) {
            const savedMarker = await res.json(); // ⬅️ hier bekommst du id, lat, lng, title, image_url
            console.log("Upload erfolgreich!", savedMarker);
            console.log("saved Marker", savedMarker);
              onSave(savedMarker);
            onClose();
          } else {
            console.error("Fehler:", await res.text());
          }
        } catch (err) {
          console.error("Fehler", err);
        }
    };

    return (
        <div>
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Neue Reise eintragen</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
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
                        <Form.Group>
                            <Form.Label>
                                <b>Koordinaten:  {lat}, { lng} </b></Form.Label>
                            
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
    )
}