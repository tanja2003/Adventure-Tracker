import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button, Form } from "react-bootstrap";


function formatForDateTimeLocal(value, isEnd) {
  if (!value) return "";

  const date = new Date(value);
  let hours = date.getHours(); 
  if (isEnd) hours += 1

  const pad = (n) => n.toString().padStart(2, "0");
  return (date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" +
    pad(date.getDate()) + "T" + pad(hours) +":" + pad(date.getMinutes()));
}


export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteEventModal, setDeleteEventModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [clickedDate, setClickedDate] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
  fetch("http://localhost:5000/api/events")
    .then(res => res.json())
    .then(data =>
      setEvents(
        data.map(ev => ({
          ...ev,
          start: new Date(ev.start),
          end: new Date(ev.end)
        }))
      )
    );
}, []);

  const handleEventClick2 = (info) => {
    console.log("yes event")
    setSelectedEventId(info.event.id);
    setDeleteEventModal(true)
  }

  const handleDelete = async () => {
    try{
      const res = await fetch(`http://localhost:5000/api/events/${selectedEventId}`, {
      method: "DELETE",
    });
    console.log("in delete", selectedEventId)
    if (res.ok) {
      setEvents((prev) => prev.filter((event) => event.id !== selectedEventId));
      setDeleteEventModal(false);
      setSelectedEventId(null);
      const calendarApi = calendarRef.current.getApi();
      const event = calendarApi.getEventById(selectedEventId);
      setEvents((prev) => prev.filter((event) => event.id !== selectedEventId));
      setDeleteEventModal(false);
      setSelectedEventId(null);
      if (event) event.remove();
    } else {
      console.error("Fehler beim Loschen: ", await res.text())
    };
    //setEvents((prev) => prev.filter((event) => event.id !== selectedEventId));
    
    }
    catch(err){
      console.log("Fehler: ", err)
    }  
  };



  const handleEventClick = () => {
    console.log("in handleEventClick 1: ", newTitle)
  if (!newTitle || !newStart || !newEnd || !clickedDate) {
    alert("Bitte Titel, Start- und Endzeit angeben");
    return;
  }
  

  // ISO-Strings für FullCalendar erzeugen
  const start = newStart; // enthält schon "2025-09-16T16:52"
const end   = newEnd;

  console.log("start ", start)
  console.log("end ", end)
  console.log("title ", newTitle)
  console.log("date ", clickedDate)

  fetch("http://localhost:5000/api/events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: newTitle, date: clickedDate, start, end })
})
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log("Server response:", data);
    setEvents([
      ...events,
      { id: data.id, title: newTitle, start: new Date(start), end: new Date(end) }
    ]);

    setShowModal(false);
  })
  .catch(err => console.error("Fehler beim Speichern:", err));

};



  const handleDateClick = (info) => {
    setClickedDate(info.dateStr);   // Basisdatum merken
    setNewStart(info.dateStr);
    setNewEnd(info.dateStr);
    setShowModal(true);             // Modal öffnen
  };

  const handleSave = () => {
    if (!newTitle) return;
    setEvents([
      ...events,
      {id: events.length + 1, title: newTitle, start: newStart, end: newEnd,},
    ]);
    setShowModal(false);
    setNewTitle("");
    setNewStart("");
    setNewEnd("");
    handleEventClick();
  };



    

  return (
    <div style={{ height: "80vh", padding: "20px" }}>
      <h2>📅 Kalenderübersicht</h2>
      <FullCalendar
       ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"   // Start = Wochenansicht
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        events={
          events
        }
        eventClick={handleEventClick2}
        dateClick={handleDateClick}
        //eventContent={renderEventContent}
        //views={CustomView}
      />
      <Modal show={showModal} onHide={() => setShowModal(false) }>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Speichern
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={deleteEventModal} onHide={() => setDeleteEventModal(false) }>
          <Modal.Header closeButton>
          <Modal.Title>Termin loschen oderhinzufügen</Modal.Title>
        </Modal.Header>
  <Modal.Body>
    <Button 
      variant="primary" 
      onClick={() => handleDelete()}
    >
      Löschen
    </Button>
    <Button>
      Neuer Termin hinzufügen
    </Button>
  </Modal.Body>

      </Modal>
    </div>
  );
}
