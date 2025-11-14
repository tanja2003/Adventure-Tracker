import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

export default function MarkerStoreModal  ({show, onClose, lat, lng, onSave}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [picture, setPictures] = useState([]);

    const handleSubmit = async (e) => {
        console.log("in handleSubmit")
        e.preventDefault();
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("title", title)
        formData.append("description", description);
        formData.append("lat", lat);
        formData.append("lng", lng);
        picture.forEach((file) => {
            formData.append("images", file);
        });
        try {
          const res = await fetch("http://localhost:5000/api/markers", {
            method: "POST",
            headers: {
            "Authorization": "Bearer " + token
            },
            body: formData, // wichtig: kein JSON.stringify hier!
          });
      
          if (res.ok) {
            const savedMarker = await res.json(); 
            onSave(savedMarker);
            onClose();
          } else {
            console.error("Fehler:", await res.text());
          }
        } catch (err) {
          console.error("Fehler", err);
        }
        setTitle("")
        setDescription("")
        setPictures([])
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
                            <Form.Control type="file" multiple accept="image/*" placeholder="Bilder hochladen" 
                                onChange={(e) => setPictures((prev) => [...prev, ...Array.from(e.target.files)])}/>
                            {picture.length > 0 && (
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                                    {picture.map((pic, i) => (
                                    <div key={i} style={{ position: "relative" }}>
                                        <img
                                            src={URL.createObjectURL(pic)}
                                            alt={`Bild ${i}`}
                                            style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            }}
                                        />
                                        <button // CloseButton
                                            onClick={() =>
                                            setPictures((prev) => prev.filter((_, index) => index !== i))
                                            }
                                            style={{ position: "absolute", top: "4px",right: "4px",
                                            background: "rgba(0,0,0,0.6)", color: "white",border: "none",
                                            borderRadius: "50%", width: "20px", height: "20px",
                                            cursor: "pointer", lineHeight: "20px",}}>
                                            ×
                                        </button>
                                        </div>
                                    ))}
                                </div>
                                )}
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