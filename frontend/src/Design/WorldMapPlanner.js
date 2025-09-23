import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, Popup, Tooltip, LayersControl, LayerGroup } from "react-leaflet";
import L, { marker } from "leaflet";
import { useMap } from 'https://cdn.esm.sh/react-leaflet/hooks'
import MarkerStoreModal from "./MarkerStoreModal";

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
  const [points, setPoints] = useState([]); // Array von [lat, lng]
  const [openMarkerStoreModal, setOpenMarkerStoreModal] = useState(false);
  const [newMarker, setNewMarker] = useState({ lat: null, lng: null });
  const [markers, setMarkers] = useState([]); 
  const animateRef = useRef(false)

  useEffect(() => {
    const loadMarkers = async () => {
      const res = await fetch("http://localhost:5000/api/markers")
      const data = await res.json();
      const coords = data.map(m => [Number(m.lat), Number(m.lng)]);
      setPoints(coords);
    // Marker-Objekte separat speichern, falls du Popups/Bilder brauchst
    setMarkers(data.map(m => ({ ...m, lat: Number(m.lat), lng: Number(m.lng) })));
    };
    loadMarkers();
  }, []);

  const addPoint = (latlng) => {
    if (!latlng) {
      // Rechtsklick -> letzten Punkt entfernen
      setPoints((prev) => prev.slice(0, -1));
      return;
    }
    console.log("latlng", latlng)
     console.log("lat", latlng[0], "; lng", latlng[1]); 
    const lat = latlng[0].toFixed(6);
    const lng = latlng[1].toFixed(6);
    setNewMarker({ lat, lng });

    // sofort verwenden:
    console.log("lat", lat, "lng", lng);
    setPoints((prev) => [...prev, latlng]);
    setOpenMarkerStoreModal(true); 
  };

  const clearAll = () => setPoints([]);
  const undo = () => setPoints((prev) => prev.slice(0, -1));

  return (
    <div className="w-full h-screen flex flex-col">
      <header className="p-4 shadow bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-semibold">🌍 Reisekarte - Entdecke alle Abenteuerorte</h1>
          <div className="ml-auto flex gap-2">
            <button onClick={undo} className="px-3 py-2 rounded-2xl shadow border">Rückgängig</button>
            <button onClick={clearAll} className="px-3 py-2 rounded-2xl shadow border">Alles löschen</button>
          </div>
        </div>
      </header>
      

      <main className="flex-1">
        <MapContainer center={[51, 10]} zoom={6} minZoom={2}
          style={{ height: "70vh", width:"100vh" }} >
          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Marker with popup">
              <LayerGroup>
                {points.map((pos, idx) => (
                  <Marker key={idx} position={pos}>
                    <Popup>
                      📍 Punkt {idx + 1}<br />
                      Koordinaten: {pos[0].toFixed(3)}, {pos[1].toFixed(3)}
                    </Popup>
                    <Tooltip>Tooltip for Marker</Tooltip>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Polylines">
              {points.length > 1 && (
            <Polyline positions={points} />
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
          <MarkerStoreModal show={openMarkerStoreModal} onClose={() => setOpenMarkerStoreModal(false)} 
            lat={newMarker.lat}
            lng={newMarker.lng}
            ></MarkerStoreModal>
        </MapContainer>
      </main>
      <footer className="p-3 text-center text-sm text-gray-500 bg-white">Links-Klick: Punkt setzen · Rechts-Klick: letzten Punkt entfernen</footer>
    </div>
  );
}
