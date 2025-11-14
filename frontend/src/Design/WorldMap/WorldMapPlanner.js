import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMapEvents} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerStoreModal from "./MarkerStoreModal";
import LightBoxModal from "../../Modals/LightBoxModal";
import { Button } from "react-bootstrap";
import ShowAdventures from "./ShowAdventures";
import LayersControlMarker from "./LayersControl";

// Leaflet benötigt eigene Icon-URLs (sonst fehlen die Marker-Pins in vielen Bundlern)
const defaultIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function ClickHandler({ onAddPoint, onUndo }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onAddPoint([lat, lng]);
    },
    contextmenu(e) {
      console.log("Klick links");
      onUndo();
    },
  });
  return null;
}


function SetViewOnClick({ animateRef }) {
 const map = useMapEvents({
  click(e) {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false,
    })}
})
  return null
}


export default function WorldMapPlanner() {
  const [openMarkerStoreModal, setOpenMarkerStoreModal] = useState(false);
  const [newMarker, setNewMarker] = useState({ lat: null, lng: null });
  const [markers, setMarkers] = useState([]); 
  const animateRef = useRef(false)
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const loadMarkers = async () => {
      const token = localStorage.getItem("token");
      console.log("token", token);
      const res = await fetch("http://localhost:5000/api/markers", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      //const res = await fetch("http://localhost:5000/api/markers")
      const data = await res.json();
      console.log("data", data);

      if (!Array.isArray(data)) {
        console.error("❌ Server hat kein Array zurückgegeben:", data);
        return; // verhindert Absturz
      }

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

  const clearAll = async () => {
    try{
      const res = await fetch("http://localhost:5000/api/markers/all", {
        method: "DELETE"
      });
      if (res.ok){
        setMarkers([]);
      } else {
        console.error("Something went wrong while delting all markers");
      }
    } catch (error) {
      console.error("Something went wrong while deleting all markers");
    }
  }

  const undo = async () =>{
    try{
      const res = await fetch(`http://localhost:5000/api/markers`, {
        method: "DELETE"
      })
      if (res.ok){
        setMarkers((prev) =>prev.slice(0,-1));
      } else{
        console.error("Something went wrong while delteting the last marker");
      }
    } catch (err) {
      console.error("Something went wrong while deleting the last marker");
    }
  }


  return (
    <div className="w-full h-screen flex flex-col">
      <header className="p-4 shadow bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-semibold">🌍 Reisekarte - Entdecke alle Abenteuerorte</h1>
        </div>
      </header>
      

      <main className="w-full" style={{position:'relative', marginLeft:'100px', marginRight:'138px', marginTop:'30px'}}>
              <h1 className="text-xl font-semibold mb-4">Weltkarte</h1>
               <div className="ml-auto flex gap-2" style={{marginBottom:"20px"}}>
            <Button variant="dark" onClick={undo} className="px-3 py-2 rounded-2xl shadow border">Rückgängig</Button>
            <Button variant="info" onClick={clearAll} className="px-3 py-2 rounded-2xl shadow border">Alles löschen</Button>
          </div>
        <MapContainer center={[48.3, 9]} zoom={9} minZoom={2}
          style={{ height: "70vh", width:"180vh", border: "4px solid black"}} >
          <LayersControlMarker
            markers={markers}
            setMarkers={setMarkers}
            setLightboxImage={setLightboxImage}>
          </LayersControlMarker>
          {/* OSM-Kachel-Layer (benötigt Internet; für Offline siehe Hinweise unten) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Mitwirkende'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <SetViewOnClick animateRef={animateRef} 
              onChange={() => {
                animateRef.current = !animateRef.current
          }}/>
          <ClickHandler onAddPoint={addPoint} onUndo={undo} />
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
      <ShowAdventures
        markers={markers}
        setMarkers={setMarkers}
        setLightboxImage={setLightboxImage}
      ></ShowAdventures>
    </div>
  );
}
