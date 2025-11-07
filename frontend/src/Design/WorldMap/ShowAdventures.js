import { Button } from "react-bootstrap";
import { Pencil } from "lucide-react";
import {useState } from "react";

export default function ShowAdventures({markers, setMarkers, setLightboxImage}){
    const [showInputBox, setShowInputBox] = useState(false);
    

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
        <div>
            <main className="w-full" style={{ marginLeft: "100px" , marginTop: "50px", marginRight: "110px"}}>
            <h1 className="text-xl font-semibold mb-4">Alle Reisen</h1>
            {markers.map((marker, idx) => (
            <div
                key={idx}
                style={{ display: "grid", gridTemplateColumns: "400px 400px", gap: "20px",
                marginBottom: "40px",padding: "20px", backgroundColor: "#fff",
                borderRadius: "16px", boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", alignItems: "start",
            }}>
                {/* Linke Spalte – Text + Aktionen */}
                <div
                    style={{ display: "flex", flexDirection: "column",
                    gap: "14px", justifyContent: "flex-start",
                }}>
                <h2 style={{ fontSize: "24px", margin: "0 0 5px 0", color: "#333" }}>
                    {marker.title}</h2>
                <p style={{ fontSize: "18px", color: "#555", margin: "0" }}>
                    {marker.description || "Keine Beschreibung vorhanden."}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px",marginTop: "10px",}}>
                    <Button variant="dark"
                      onClick={() =>
                        setShowInputBox(showInputBox === idx ? null : idx)}>
                      Beschreibung anpassen
                    </Button>
                    <Pencil size={18} color="#555" />
                </div>

                {/* Eingabefeld nur anzeigen, wenn Button geklickt */}
                {showInputBox === idx && (
                    <>
                    <input 
                        type="text" placeholder="Neue Beschreibung eingeben..."
                        value={marker.description}
                        style={{padding: "10px", border: "1px solid #ccc",
                            borderRadius: "8px", width: "100%", fontSize: "16px", marginTop: "8px",
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
                        >Save</Button>
                        <Button
                            style={{ width: "100px" }}
                            variant="danger"
                            onClick={() => setShowInputBox(null)}
                        > Abbrechen</Button>
                    </div>
                    </>
                )}
                </div>

                {/* Rechte Spalte – Bild */}
                <div style={{ position:"relative", marginLeft: "calc(0%)",   width: "65vw", overflow: "hidden", alignSelf: "stretch" }}>
                {marker.images[0] ? (
                    <div style={{ display: "flex", overflowX: "auto", scrollBehavior: "smooth",
                        padding: "10px 50px", gap: "20px", width: "100%", 
                    }}>
                    {marker.images.map((img, i) => (
                        <img
                        key={i}
                        src={`http://localhost:5000${img}`}
                        alt={`${marker.title} ${i + 1}`}
                        style={{ width: "auto", height: "300px", borderRadius: "12px",
                            boxShadow: "0 6px 12px rgba(0,0,0,0.15)", cursor: "pointer",
                            transition: "transform 0.3s ease", marginRight:"20px"
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
                    style={{ width: "100%", height: "250px", borderRadius: "12px",
                        backgroundColor: "#f0f0f0", color: "#888", display: "flex",
                        alignItems: "center", justifyContent: "center", fontStyle: "italic",
                    }}>Kein Bild vorhanden</div>
                )}
                </div>
            </div>
            ))}
            </main>
        </div>
    );
}