import { Modal, Button } from "react-bootstrap";

export default function DeleteEventModal ({show, onClose, onConfirm, selectedEventId, clickedDate, onNewAppointment} ) {
    return (
        <div>
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Termin loschen oder hinzufügen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="danger" className="me-2"
                        onClick={() => onConfirm(selectedEventId)}>
                        Löschen
                    </Button>
                    <Button onClick={onNewAppointment}> Weiterer Termin hinzufügen </Button>
                </Modal.Body>
            </Modal>
        </div>
    )
}