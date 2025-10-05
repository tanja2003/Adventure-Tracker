import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, Popup, Tooltip, LayersControl, LayerGroup } from "react-leaflet";
import L, { marker } from "leaflet";
import { useMap } from 'https://cdn.esm.sh/react-leaflet/hooks'
import MarkerStoreModal from "../Modals/MarkerStoreModal";
import LightBoxModal from "../Modals/LightBoxModal";

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
  const [lightboxImage, setLightboxImage] = useState(null);



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
        <MapContainer center={[48.5, 9]} zoom={8} minZoom={2}
          style={{ height: "70vh", width:"100vh" }} >
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
                      {marker.image_url && (
                        <img
                          src={`http://localhost:5000${marker.image_url}`}
                          alt={marker.title}
                          style={{ width: "200px", height: "auto" }}
                          onClick={() => setLightboxImage(`http://localhost:5000${marker.image_url}`)}
                        />
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
    </div>
  );
}
