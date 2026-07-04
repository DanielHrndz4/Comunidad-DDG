import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getDelimitationData } from "../../utils/delimitationStore";
import { getTaskHomeRequest } from "../../api/task";

export default function MapViewer() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const circleRef = useRef<L.Circle | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const dangerCirclesRef = useRef<L.Circle[]>([]);

    const [delim, setDelim] = useState(getDelimitationData());

    // Listen to live updates of the boundary settings
    useEffect(() => {
        const handleUpdate = () => {
            const freshData = getDelimitationData();
            setDelim(freshData);
        };
        
        window.addEventListener("delimitation_updated", handleUpdate);
        return () => window.removeEventListener("delimitation_updated", handleUpdate);
    }, []);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const offset = 0.012;
        const maxBounds = L.latLngBounds(
            [delim.lat - offset, delim.lng - offset],
            [delim.lat + offset, delim.lng + offset]
        );

        const map = L.map(mapContainerRef.current, {
            center: [delim.lat, delim.lng],
            zoom: 15,
            maxBounds: maxBounds,
            maxBoundsViscosity: 0.8,
            minZoom: 14,
            zoomControl: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 18,
        }).addTo(map);

        mapRef.current = map;

        // Draw boundary zone circle
        const circle = L.circle([delim.lat, delim.lng], {
            color: "#2dbda1",
            fillColor: "#2dbda1",
            fillOpacity: 0.15,
            radius: delim.radius,
            dashArray: "6, 6",
            weight: 2,
        }).addTo(map);
        circleRef.current = circle;

        // Fetch and draw danger zones (heat zones)
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
                        fillOpacity: 0.35,
                        radius: 15, // Small radius (15m)
                        weight: 2,
                        dashArray: "3, 3"
                    })
                    .addTo(map);

                    const dangerMarker = L.marker([lat, lng], { icon: dangerMarkerIcon })
                    .addTo(map);

                    const popupContent = `
                        <div style="font-family: 'Montserrat', sans-serif; font-size: 12px; color: #142B36; min-width: 150px;">
                            <strong style="color: #e54a55; display: block; margin-bottom: 4px;">⚠️ ZONA DE PELIGRO</strong>
                            <strong style="display: block; margin-bottom: 2px;">${task.title}</strong>
                            <span style="color: #6e6e73; font-size: 11px; display: block; max-height: 60px; overflow-y: auto;">${task.description || ""}</span>
                        </div>
                    `;

                    dangerCircle.bindPopup(popupContent);
                    dangerMarker.bindPopup(popupContent);

                    circles.push(dangerCircle);
                    circles.push(dangerMarker);
                }
            });
            dangerCirclesRef.current = circles as any;
        }).catch((err) => console.error("Error drawing danger zones:", err));

        // Marker icon fix for Leaflet
        const markerIcon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });

        // Add pin at the center of the colony
        const marker = L.marker([delim.lat, delim.lng], { icon: markerIcon })
            .addTo(map)
            .bindPopup("<b>Centro de Colonia Vista Hermosa</b>")
            .openPopup();
        markerRef.current = marker;

        // Add custom zoom control on bottom right
        L.control.zoom({ position: "bottomright" }).addTo(map);

        setTimeout(() => {
            map.invalidateSize();
        }, 150);

        return () => {
            dangerCirclesRef.current.forEach((c) => c.remove());
            dangerCirclesRef.current = [];
            map.remove();
            mapRef.current = null;
            circleRef.current = null;
            markerRef.current = null;
        };
    }, [delim.lat, delim.lng, delim.radius]); // Recreate/recenter if center/radius updates

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: "280px",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1.5px solid rgba(20, 43, 54, 0.08)",
            }}
        >
            <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
}
