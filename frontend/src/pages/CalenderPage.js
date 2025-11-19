import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddAppointmentModal from "../Modals/AddAppointmentModal";
import DeleteEventModal from "../Modals/DeleteEventModal";
import { useNavigate } from "react-router-dom";



export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteEventModal, setDeleteEventModal] = useState(false);
  const [clickedDate, setClickedDate] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const calendarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
  const loadEvents = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/events", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    const data = await res.json();
    if (res.status === 401){
        console.warn("Token expired or invalid. Redirecting to login...");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

    if (res.ok){
      setEvents(
      data.map(ev =>({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end)
      }))
    );}
  }
    loadEvents();
}, []);

  const handleEventClick = (info) => {
    setClickedDate(info.event.start);
    setSelectedEventId(info.event.id);
    setDeleteEventModal(true)
  }

  const handleDelete = async (selectedEventId) => {
    try{
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/events/${selectedEventId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (res.status === 401){
        console.warn("Token expired or invalid. Redirecting to login...");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

    if (res.ok) {
      const calendarApi = calendarRef.current.getApi();
      const event = calendarApi.getEventById(selectedEventId);
      setEvents((prev) => prev.filter((event) => event.id !== selectedEventId));
      setDeleteEventModal(false);
      setSelectedEventId(null);
      if (event) event.remove();
    } else {
      console.error("Fehler beim Loschen: ", await res.text())
    };}
    catch(err){
      console.log("Fehler: ", err)
    }  
  };

  const handleDateClick = (info) => {
    setClickedDate(info.dateStr);   // remember date
    setShowModal(true);             // open Modal
  };

  const handleSaveEvent = (newEvent) => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json",
                 "Authorization": `Bearer ${token}`
       },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Event gespeichert:", data);
        setEvents([...events, { id: data.id, ...newEvent }]);
      })
      .catch((err) => console.error("Fehler beim Speichern:", err));
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
        events={ events}
        //eventColor="#999999ff"
        eventClick={handleEventClick}
        dateClick={handleDateClick}
      />
      <AddAppointmentModal
        show={showModal} onClose={() => setShowModal(false)}
        clickedDate={clickedDate} onSave={handleSaveEvent}/>

      <DeleteEventModal
        show={deleteEventModal}
        onClose={() => setDeleteEventModal(false)}
        onConfirm={handleDelete}
        selectedEventId={selectedEventId}
        clickedDate={clickedDate} 
        onNewAppointment ={ () => {setDeleteEventModal(false)
                          setShowModal(true)}
        }
      />
    </div>
  );
}
