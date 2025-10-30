import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, Popup, Tooltip, LayersControl, LayerGroup } from "react-leaflet";
import L, { marker } from "leaflet";
import MarkerStoreModal from "../Modals/MarkerStoreModal";
import LightBoxModal from "../Modals/LightBoxModal";
import { Button } from "react-bootstrap";
import { Pencil } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Leaflet benötigt eigene Icon-URLs (sonst fehlen die Marker-Pins in vielen Bundlern)
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function ClickHandler({ onAddPoint }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onAddPoint([lat, lng]);
    },
    contextmenu(e) {
      onAddPoint(null);
    },
  });
  return null;
}


function SetViewOnClick({ animateRef }) {
 const map = useMapEvents({
  click(e) {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false,
    })
  }
})
  return null
}


export default function WorldMapPlanner() {
  const [openMarkerStoreModal, setOpenMarkerStoreModal] = useState(false);
  const [newMarker, setNewMarker] = useState({ lat: null, lng: null });
  const [markers, setMarkers] = useState([]); 
  const animateRef = useRef(false)
  const [lightboxImage, setLightboxImage] = useState(null);
  const [showInputBox, setShowInputBox] = useState(false);
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(false)


  useEffect(() => {
    const loadMarkers = async () => {
      const res = await fetch("http://localhost:5000/api/markers")
      const data = await res.json();
      const markersWithNumbers = data.map(m => ({
      ...m,
      lat: Number(m.lat),
      lng: Number(m.lng)
    }));
    setMarkers(markersWithNumbers);
    };
    loadMarkers();
  }, []);

  const addPoint = (latlng) => {
    const lat = Math.round(latlng[0] * 1e6) / 1e6;
    const lng = Math.round(latlng[1] * 1e6) / 1e6;

    setNewMarker({ lat, lng });
    setOpenMarkerStoreModal(true); 
  };

  const clearAll = () => setMarkers([]);
  const undo = () => setMarkers((prev) => prev.slice(0, -1));


  const  handleDescriptionChange =  async (index, newDescription) => {
    const res = await fetch(`http://localhost:5000/api/markers/${index}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({description: newDescription})
    });
    if (!res.ok) console.error("Fehler beim aktualisieren", await res.text());
    setShowInputBox(false)
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <header className="p-4 shadow bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-semibold">🌍 Reisekarte - Entdecke alle Abenteuerorte</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="dark" onClick={undo} className="px-3 py-2 rounded-2xl shadow border">Rückgängig</Button>
            <Button variant="info" onClick={clearAll} className="px-3 py-2 rounded-2xl shadow border">Alles löschen</Button>
          </div>
        </div>
      </header>
      
      <main className="w-full" style={{position:'relative', marginLeft:'100px', marginRight:'113px', marginTop:'30px', border: "4px solid black"}}>
        <border>
          
        </border>
        <MapContainer center={[48.3, 9]} zoom={9} minZoom={2}
          style={{ height: "70vh", width:"180vh", }} >
          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Marker with popup">
              <LayerGroup>
                {markers.map((marker, idx) => (
                  <Marker key={marker.id ?? idx} position={[Number(marker.lat), Number(marker.lng)]}
                   eventHandlers={{
                    contextmenu: () => { // delete marker
                      setMarkers(prev => prev.filter(m => m.id !== marker.id));
                    }
                  }}>
                    <Popup>
                      <h4>{marker.title}</h4>
                      <p>{marker.description}</p>

                      {marker.images && marker.images.length > 0 && (
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                          {marker.images.map((img, i) => (
                            <img
                              key={i}
                              src={`http://localhost:5000${img}`}
                              alt={`${marker.title} ${i + 1}`}
                              style={{ width: "100px", height: "100px", objectFit: "cover", cursor: "pointer" }}
                              onClick={() => setLightboxImage(`http://localhost:5000${img}`)}
                            />
                          ))}
                        </div>
                      )}
                    </Popup>
                    <Tooltip>{marker.title}</Tooltip>
                  </Marker>
                ))}

              </LayerGroup>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Polylines">
              {markers.length > 1 && (
            <Polyline positions={markers.map(m => [m.lat, m.lng])} />

          )}
            </LayersControl.Overlay>
          </LayersControl>
          {/* OSM-Kachel-Layer (benötigt Internet; für Offline siehe Hinweise unten) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Mitwirkende'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <SetViewOnClick animateRef={animateRef} 
              onChange={() => {
                animateRef.current = !animateRef.current
          }}/>
          <ClickHandler onAddPoint={addPoint} />
          <MarkerStoreModal show={openMarkerStoreModal} 
            onClose={() => {
              setOpenMarkerStoreModal(false); }} 
            lat={newMarker.lat}
            lng={newMarker.lng}
            onSave={(savedMarker) => {
              setMarkers((prev) => [...prev, savedMarker]); 
              setOpenMarkerStoreModal(false);
            }}
           
            ></MarkerStoreModal>
            <LightBoxModal
              src={lightboxImage}
              onClose={() => setLightboxImage(null)}
            />
        </MapContainer>
      </main>
      <footer className="p-3 text-center text-sm text-gray-500 bg-white">Links-Klick: Punkt setzen · Rechts-Klick: letzten Punkt entfernen</footer>
      <main className="w-full" style={{ marginLeft: "100px" , marginTop: "50px", marginRight: "110px"}}>
      <h1 className="text-xl font-semibold mb-4">Alle Reisen</h1>

      {markers.map((marker, idx) => (
  <div
    key={idx}
    style={{
      display: "grid",
      gridTemplateColumns: "600px 400px",
      gap: "20px",
      marginBottom: "40px",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      alignItems: "start",
    }}
  >
    {/* Linke Spalte – Text + Aktionen */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        justifyContent: "flex-start",
      }}
    >
      <h2 style={{ fontSize: "24px", margin: "0 0 5px 0", color: "#333" }}>
        {marker.title}
      </h2>

      <p style={{ fontSize: "18px", color: "#555", margin: "0" }}>
        {marker.description || "Keine Beschreibung vorhanden."}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <Button
          variant="dark"
          onClick={() =>
            setShowInputBox(showInputBox === idx ? null : idx)
          }
        >
          Beschreibung anpassen
        </Button>
        <Pencil size={18} color="#555" />
      </div>

      {/* Eingabefeld nur anzeigen, wenn Button geklickt */}
      {showInputBox === idx && (
        <>
          <input
            type="text"
            placeholder="Neue Beschreibung eingeben..."
            value={marker.description}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "100%",
              fontSize: "16px",
              marginTop: "8px",
            }}
            onChange={(e) => {
              const newMarkers = [...markers];
              newMarkers[idx].description = e.target.value;
              setMarkers(newMarkers);
            }}
          />
          <div style={{ marginTop: "10px" }}>
            <Button
              style={{ width: "100px", marginRight: "10px" }}
              onClick={(e) =>
                handleDescriptionChange(marker.id, marker.description)
              }
              variant="primary"
            >
              Save
            </Button>
            <Button
              style={{ width: "100px" }}
              variant="danger"
              onClick={() => setShowInputBox(null)}
            >
              Abbrechen
            </Button>
          </div>
        </>
      )}
    </div>

    {/* Rechte Spalte – Bild */}
    <div style={{ position:"relative", marginLeft: "calc(-0vw + 20%)",   width: "52vw", overflow: "hidden", alignSelf: "stretch",    }}>
      {marker.images[0] ? (
        <div style={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          padding: "10px 50px", // Platz für Pfeile
          gap: "20px",
          width: "100%", 
        }}>
          {marker.images.map((img, i) => (
            <img
            key={i}
          src={`http://localhost:5000${img}`}
          alt={`${marker.title} ${i + 1}`}
          style={{
            width: "auto",
            height: "300px",
            borderRadius: "12px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            marginRight:"20px"
          }}
          onClick={() =>
            setLightboxImage(`http://localhost:5000${img}`)
          }
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        ))}
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "250px",
            borderRadius: "12px",
            backgroundColor: "#f0f0f0",
            color: "#888",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontStyle: "italic",
          }}
        >
          Kein Bild vorhanden
        </div>
      )}
    </div>
  </div>
))}
    </main>

    </div>
  );
}
