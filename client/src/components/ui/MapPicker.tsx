import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { getDelimitationData } from "../../utils/delimitationStore";
import { getTaskHomeRequest } from "../../api/task";

interface Props {
    lat: string;
    lng: string;
    onChange: (lat: string, lng: string) => void;
    isDangerZone?: boolean;
}

export default function MapPicker({ lat, lng, onChange, isDangerZone }: Props) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const circleRef = useRef<L.Circle | null>(null);
    const dangerCirclesRef = useRef<L.Circle[]>([]);
    const selectedDangerCircleRef = useRef<L.Circle | null>(null);
    
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [delim, setDelim] = useState(getDelimitationData());

    // Listen to live updates of the boundary settings
    useEffect(() => {
        const handleUpdate = () => {
            const freshData = getDelimitationData();
            setDelim(freshData);
            
            // Live update the map circle and center if map is already active
            if (mapRef.current) {
                const newCenter = L.latLng(freshData.lat, freshData.lng);
                
                if (circleRef.current) {
                    circleRef.current.setLatLng(newCenter);
                    circleRef.current.setRadius(freshData.radius);
                }
                
                // Adjust max bounds
                const offset = 0.015;
                const maxBounds = L.latLngBounds(
                    [freshData.lat - offset, freshData.lng - offset],
                    [freshData.lat + offset, freshData.lng + offset]
                );
                mapRef.current.setMaxBounds(maxBounds);
            }
        };
        
        window.addEventListener("delimitation_updated", handleUpdate);
        return () => window.removeEventListener("delimitation_updated", handleUpdate);
    }, []);

    // Effect to manage active danger circle around user's selected marker position
    useEffect(() => {
        const map = mapRef.current;
        const marker = markerRef.current;
        if (!map || !marker) return;

        const valLat = parseFloat(lat);
        const valLng = parseFloat(lng);
        const hasCoords = !isNaN(valLat) && !isNaN(valLng);

        if (!isDangerZone || !hasCoords) {
            if (selectedDangerCircleRef.current) {
                selectedDangerCircleRef.current.remove();
                selectedDangerCircleRef.current = null;
            }
            return;
        }

        const pos = L.latLng(valLat, valLng);
        if (!selectedDangerCircleRef.current) {
            selectedDangerCircleRef.current = L.circle(pos, {
                color: "#e54a55",
                fillColor: "#e54a55",
                fillOpacity: 0.25,
                radius: 15, // Small radius (15m)
                weight: 2,
                dashArray: "4, 4"
            }).addTo(map);
        } else {
            selectedDangerCircleRef.current.setLatLng(pos);
        }
    }, [isDangerZone, lat, lng]);

    const lastValidRef = useRef<L.LatLng>(L.latLng(delim.lat, delim.lng));

    const isWithinBounds = (latlng: L.LatLng): boolean => {
        const center = L.latLng(delim.lat, delim.lng);
        const distance = latlng.distanceTo(center);
        return distance <= delim.radius;
    };

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const initialLat = lat ? parseFloat(lat) : delim.lat;
        const initialLng = lng ? parseFloat(lng) : delim.lng;

        const offset = 0.015;
        const maxBounds = L.latLngBounds(
            [delim.lat - offset, delim.lng - offset],
            [delim.lat + offset, delim.lng + offset]
        );

        const map = L.map(mapContainerRef.current, {
            center: [initialLat, initialLng],
            zoom: lat && lng ? 16 : 15,
            maxBounds: maxBounds,
            maxBoundsViscosity: 0.8,
            minZoom: 14,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;

        // Draw boundary zone circle and keep ref to update it live
        const circle = L.circle([delim.lat, delim.lng], {
            color: "#2dbda1",
            fillColor: "#2dbda1",
            fillOpacity: 0.1,
            radius: delim.radius,
            dashArray: "6, 6",
            weight: 2,
        }).addTo(map);
        circleRef.current = circle;

        const markerIcon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });

        const hasCoords = lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));
        const marker = L.marker([initialLat, initialLng], {
            icon: markerIcon,
            draggable: true,
        });

        if (hasCoords) {
            marker.addTo(map);
        }
        markerRef.current = marker;

        // Fetch and draw existing danger zones (heat zones) so user sees them when picking a point
        const dangerMarkerIcon = L.icon({
            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });

        getTaskHomeRequest().then((res) => {
            const tasks = res.data?.data || [];
            const circles: (L.Circle | L.Marker)[] = [];
            tasks.forEach((task: any) => {
                if (task.isDangerZone && task.location?.coordinates?.length === 2) {
                    const [lng, lat] = task.location.coordinates;
                    
                    const dangerCircle = L.circle([lat, lng], {
                        color: "#e54a55",
                        fillColor: "#e54a55",
                        fillOpacity: 0.3,
                        radius: 15, // Small radius (15m)
                        weight: 2,
                        dashArray: "3, 3"
                    })
                    .addTo(map);

                    const dangerMarker = L.marker([lat, lng], { icon: dangerMarkerIcon })
                    .addTo(map);

                    const popupContent = `
                        <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; color: #142B36; min-width: 130px;">
                            <strong style="color: #e54a55; display: block; margin-bottom: 2px;">⚠️ ZONA DE RIESGO</strong>
                            <strong>${task.title}</strong>
                            <span style="color: #6e6e73; font-size: 10px; display: block; margin-top: 2px;">${task.description || ""}</span>
                        </div>
                    `;

                    dangerCircle.bindPopup(popupContent);
                    dangerMarker.bindPopup(popupContent);

                    circles.push(dangerCircle);
                    circles.push(dangerMarker);
                }
            });
            dangerCirclesRef.current = circles as any;
        }).catch((err) => console.error("Error drawing danger zones in MapPicker:", err));

        map.on("click", (e: L.LeafletMouseEvent) => {
            if (!isWithinBounds(e.latlng)) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Ubicación fuera del perímetro delimitado",
                    showConfirmButton: false,
                    timer: 2000,
                    background: "#ffffff",
                    color: "#142B36",
                });
                return;
            }
            const newLat = e.latlng.lat.toFixed(6);
            const newLng = e.latlng.lng.toFixed(6);
            marker.setLatLng(e.latlng);
            if (!map.hasLayer(marker)) {
                marker.addTo(map);
            }
            lastValidRef.current = e.latlng;
            onChange(newLat, newLng);
        });

        marker.on("dragend", () => {
            const position = marker.getLatLng();
            if (!isWithinBounds(position)) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Ubicación fuera del perímetro delimitado",
                    showConfirmButton: false,
                    timer: 2000,
                    background: "#ffffff",
                    color: "#142B36",
                });
                marker.setLatLng(lastValidRef.current);
                return;
            }
            const newLat = position.lat.toFixed(6);
            const newLng = position.lng.toFixed(6);
            lastValidRef.current = position;
            onChange(newLat, newLng);
        });

        setTimeout(() => {
            map.invalidateSize();
        }, 100);

        return () => {
            dangerCirclesRef.current.forEach((c) => c.remove());
            dangerCirclesRef.current = [];
            if (selectedDangerCircleRef.current) {
                selectedDangerCircleRef.current.remove();
                selectedDangerCircleRef.current = null;
            }
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
            circleRef.current = null;
        };
    }, [delim.lat, delim.lng]); // Recreate map instance if center coordinates change

    useEffect(() => {
        if (!mapRef.current || !markerRef.current) return;
        const valLat = parseFloat(lat);
        const valLng = parseFloat(lng);
        if (isNaN(valLat) || isNaN(valLng)) {
            if (mapRef.current.hasLayer(markerRef.current)) {
                mapRef.current.removeLayer(markerRef.current);
            }
            return;
        }

        const rawLatLng = L.latLng(valLat, valLng);
        if (!isWithinBounds(rawLatLng)) {
            markerRef.current.setLatLng(lastValidRef.current);
            return;
        }

        const currentMarkerLatLng = markerRef.current.getLatLng();
        if (
            currentMarkerLatLng.lat.toFixed(6) !== rawLatLng.lat.toFixed(6) ||
            currentMarkerLatLng.lng.toFixed(6) !== rawLatLng.lng.toFixed(6)
        ) {
            markerRef.current.setLatLng(rawLatLng);
            if (!mapRef.current.hasLayer(markerRef.current)) {
                markerRef.current.addTo(mapRef.current);
            }
            mapRef.current.setView(rawLatLng, 16);
            lastValidRef.current = rawLatLng;
            onChange(rawLatLng.lat.toFixed(6), rawLatLng.lng.toFixed(6));
        }
    }, [lat, lng]);

    useEffect(() => {
        if (mapRef.current) {
            setTimeout(() => {
                mapRef.current?.invalidateSize();
            }, 100);
        }
    }, [isExpanded]);

    const containerStyle: React.CSSProperties = isExpanded
        ? {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 99999,
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
          }
        : {
              position: "relative",
              width: "100%",
              height: "220px",
              borderRadius: "14px",
              overflow: "hidden",
              border: "1.5px solid rgba(20, 43, 54, 0.08)",
          };

    return (
        <div style={containerStyle}>
            {isExpanded && (
                <div
                    style={{
                        background: "#142B36",
                        color: "#ffffff",
                        padding: "16px 24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontFamily: "'Montserrat', sans-serif",
                    }}
                >
                    <div>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>
                            Mapa de Ubicación de Reporte
                        </h3>
                        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                            Haz clic o arrastra el marcador para fijar el punto exacto dentro de la zona delimitada.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        style={{
                            background: "rgba(255, 255, 255, 0.15)",
                            border: "none",
                            color: "#ffffff",
                            padding: "8px 16px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "13px",
                            fontFamily: "'Montserrat', sans-serif",
                        }}
                    >
                        <FiMinimize2 size={16} />
                        <span>Minimizar</span>
                    </button>
                </div>
            )}

            <div ref={mapContainerRef} style={{ width: "100%", height: isExpanded ? "calc(100vh - 78px)" : "100%" }} />

            {!isExpanded && (
                <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        zIndex: 1000,
                        background: "rgba(20, 43, 54, 0.9)",
                        border: "none",
                        color: "#ffffff",
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        transition: "background 0.2s",
                    }}
                    title="Maximizar mapa"
                >
                    <FiMaximize2 size={18} />
                </button>
            )}

            {!isExpanded && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        background: "rgba(20, 43, 54, 0.85)",
                        color: "#fff",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        fontSize: "10px",
                        fontWeight: 700,
                        zIndex: 1000,
                        pointerEvents: "none",
                        fontFamily: "'Montserrat', sans-serif",
                        letterSpacing: "0.2px",
                    }}
                >
                    Zona: {delim.radius}m
                </div>
            )}
        </div>
    );
}
