import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function formatForDateTimeLocal(value, isEnd) {
  if (!value) return "";

  const date = new Date(value);
  let hours = date.getHours(); 
  console.log("H1", hours)
  if (isEnd) {
    //hours += 1
    console.log("H2",hours)
  }

  const pad = (n) => n.toString().padStart(2, "0");
  return (date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" +
    pad(date.getDate()) + "T" + pad(hours) +":" + pad(date.getMinutes()));
}

export default function AddAppointmentModal ({show, onClose, clickedDate, onSave}) {
    const [newTitle, setNewTitle] = useState("");
    const [newStart, setNewStart] = useState("");
    const [newEnd, setNewEnd] = useState("");

    useEffect(() => {
      if (clickedDate){
        setNewStart(clickedDate);
        const endDate = new Date(clickedDate);
        endDate.setHours(endDate.getHours() + 2);
        const endISO = endDate.toISOString().slice(0, 16);
        setNewEnd(endISO)
    }
    }, [clickedDate]);



    const handleSave = () => {
    if (!newTitle || !newStart || !newEnd) {
      alert("Bitte Titel, Start- und Endzeit angeben");
      return;
    }
    // Event-Dates to parent
    onSave({
      title: newTitle,
      date: clickedDate,
      start: newStart,
      end: newEnd,
    });

    setNewTitle("");
    setNewStart("");
    setNewEnd("");
    onClose();
  };
    
    return (
        <div>
            <Modal show={show} onHide={onClose }>
              <Modal.Header closeButton>
                <Modal.Title>Neuen Termin hinzufügen</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Titel</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Titel eingeben"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Startzeit</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={formatForDateTimeLocal(newStart, false)}
                      onChange={(e) => setNewStart(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Endzeit</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={formatForDateTimeLocal(newEnd, true)}
                      onChange={(e) => setNewEnd(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                  Abbrechen
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Speichern
                </Button>
              </Modal.Footer>
            </Modal>
        </div>
    )
}