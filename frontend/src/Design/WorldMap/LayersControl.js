import { Marker, Polyline, Popup, Tooltip, LayersControl, LayerGroup } from "react-leaflet";

export default function LayersControlMarker({markers, setMarkers, setLightboxImage}){


    return (
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
    )
}