import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getTaskHomeRequest, getNearbyTasksRequest } from "../../api/task.js";

// Corrige el ícono de marcador por defecto de Leaflet con Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ICON_NORMAL = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const ICON_NEARBY = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// El Salvador centrado
const EL_SALVADOR_CENTER = [13.7942, -88.8965];
const DEFAULT_ZOOM = 9;

export default function AdminSIGView() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersLayerRef = useRef(null);
    const nearbyLayerRef = useRef(null);
    const radiusCircleRef = useRef(null);

    const [allTasks, setAllTasks] = useState([]);
    const [nearbyResult, setNearbyResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState("");

    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [radius, setRadius] = useState("1000");

    // Inicializa el mapa
    useEffect(() => {
        if (mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            center: EL_SALVADOR_CENTER,
            zoom: DEFAULT_ZOOM,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        markersLayerRef.current = L.layerGroup().addTo(map);
        nearbyLayerRef.current = L.layerGroup().addTo(map);

        // Click en mapa → rellena coordenadas de búsqueda
        map.on("click", (e) => {
            setLatitude(e.latlng.lat.toFixed(6));
            setLongitude(e.latlng.lng.toFixed(6));
        });

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Carga y pinta todas las tareas con ubicación
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const res = await getTaskHomeRequest();
                const tasksWithLocation = res.data.filter(
                    (t) => t.location?.coordinates?.length === 2
                );
                setAllTasks(tasksWithLocation);
            } catch {
                // Si falla, el mapa simplemente queda vacío
            }
        };
        loadTasks();
    }, []);

    // Pinta marcadores normales cuando cambia la lista de tareas
    useEffect(() => {
        if (!markersLayerRef.current) return;
        markersLayerRef.current.clearLayers();

        allTasks.forEach((task) => {
            const [lng, lat] = task.location.coordinates;
            L.marker([lat, lng], { icon: ICON_NORMAL })
                .bindPopup(buildPopupHtml(task))
                .addTo(markersLayerRef.current);
        });
    }, [allTasks]);

    const buildPopupHtml = (task) => {
        const imgHtml = task.image
            ? `<img src="${task.image}" alt="img" style="width:100%;max-height:100px;object-fit:cover;border-radius:6px;margin-bottom:4px;"/>`
            : "";
        return `
            <div style="min-width:160px;font-family:sans-serif;">
                ${imgHtml}
                <strong style="font-size:0.9rem;">${task.title}</strong><br/>
                <span style="font-size:0.8rem;color:#555;">${task.description || ""}</span><br/>
                <small style="color:#999;">📍 ${task.location.coordinates[1].toFixed(4)}, ${task.location.coordinates[0].toFixed(4)}</small>
            </div>
        `;
    };

    const handleGeolocate = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            setLatitude(pos.coords.latitude.toFixed(6));
            setLongitude(pos.coords.longitude.toFixed(6));
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchError("");

        const lng = parseFloat(longitude);
        const lat = parseFloat(latitude);
        const rad = parseFloat(radius);

        if (isNaN(lng) || isNaN(lat) || isNaN(rad)) {
            setSearchError("Ingresa coordenadas y radio válidos.");
            return;
        }

        setLoading(true);
        try {
            const res = await getNearbyTasksRequest(lng, lat, rad);
            const geojson = res.data;
            setNearbyResult(geojson);
            paintNearbyResults(geojson, lat, lng, rad);
        } catch {
            setSearchError("Error al consultar el servidor.");
        } finally {
            setLoading(false);
        }
    };

    const paintNearbyResults = (geojson, lat, lng, rad) => {
        if (!nearbyLayerRef.current || !mapInstanceRef.current) return;
        nearbyLayerRef.current.clearLayers();

        if (radiusCircleRef.current) {
            radiusCircleRef.current.remove();
        }

        // Dibuja el círculo de búsqueda
        radiusCircleRef.current = L.circle([lat, lng], {
            radius: rad,
            color: "#E34234",
            fillColor: "#E34234",
            fillOpacity: 0.08,
            weight: 2,
        }).addTo(mapInstanceRef.current);

        // Marcador del punto central
        L.marker([lat, lng], {
            icon: L.divIcon({
                html: `<div style="background:#E34234;width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6],
                className: "",
            }),
        })
            .bindPopup(`<b>Centro de búsqueda</b><br/>Radio: ${rad} m`)
            .addTo(nearbyLayerRef.current);

        // Pinta los resultados con ícono rojo
        geojson.features.forEach((feature) => {
            const [fLng, fLat] = feature.geometry.coordinates;
            const { title, description, image } = feature.properties;
            const task = { title, description, image, location: { coordinates: [fLng, fLat] } };
            L.marker([fLat, fLng], { icon: ICON_NEARBY })
                .bindPopup(buildPopupHtml(task))
                .addTo(nearbyLayerRef.current);
        });

        // Centra el mapa en el círculo
        mapInstanceRef.current.fitBounds(
            L.latLng(lat, lng).toBounds(rad * 2),
            { padding: [40, 40] }
        );
    };

    const handleClearSearch = () => {
        nearbyLayerRef.current?.clearLayers();
        radiusCircleRef.current?.remove();
        radiusCircleRef.current = null;
        setNearbyResult(null);
        setSearchError("");
    };

    return (
        <div className="flex flex-col h-screen bg-[#F5F5F7]">
            {/* Encabezado */}
            <div className="px-8 py-5 bg-white shadow-sm">
                <h1 className="text-2xl font-semibold text-[#1D1D1F]">
                    Módulo SIG — Mapa de Tareas
                </h1>
                <p className="text-sm text-[#6E6E73] mt-1">
                    Visualiza tareas geolocalizadas y busca las más cercanas a un punto.
                    <span className="ml-2 text-[#0071E3]">Haz clic en el mapa para seleccionar coordenadas.</span>
                </p>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Panel lateral de búsqueda */}
                <aside className="w-80 bg-white border-r border-[#D2D2D7] flex flex-col gap-0 overflow-y-auto">
                    {/* Estadísticas */}
                    <div className="px-5 py-4 bg-[#F5F5F7] border-b border-[#D2D2D7]">
                        <p className="text-sm text-[#6E6E73]">
                            Tareas con ubicación: <span className="font-semibold text-[#1D1D1F]">{allTasks.length}</span>
                        </p>
                    </div>

                    {/* Formulario de búsqueda cercana */}
                    <form onSubmit={handleSearch} className="flex flex-col gap-4 px-5 py-5 border-b border-[#D2D2D7]">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-[#1D1D1F]">Buscar cercanas</h2>
                            <button
                                type="button"
                                onClick={handleGeolocate}
                                className="text-xs px-2 py-1 rounded-full bg-[#34C759] text-white hover:brightness-90"
                            >
                                📍 Mi ubicación
                            </button>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#6E6E73]">Longitud</label>
                            <input
                                type="number"
                                step="any"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                placeholder="-89.2182"
                                className="border border-[#D2D2D7] rounded-lg px-3 py-2 text-sm text-[#1D1D1F] bg-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-[#0071E3]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#6E6E73]">Latitud</label>
                            <input
                                type="number"
                                step="any"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                placeholder="13.6929"
                                className="border border-[#D2D2D7] rounded-lg px-3 py-2 text-sm text-[#1D1D1F] bg-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-[#0071E3]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#6E6E73]">Radio (metros)</label>
                            <input
                                type="number"
                                min="1"
                                value={radius}
                                onChange={(e) => setRadius(e.target.value)}
                                placeholder="1000"
                                className="border border-[#D2D2D7] rounded-lg px-3 py-2 text-sm text-[#1D1D1F] bg-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-[#0071E3]"
                            />
                        </div>

                        {searchError && (
                            <p className="text-xs text-red-500">{searchError}</p>
                        )}

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-[#0071E3] text-white rounded-lg py-2 text-sm font-medium hover:brightness-90 disabled:opacity-50"
                            >
                                {loading ? "Buscando..." : "Buscar"}
                            </button>
                            {nearbyResult && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="px-3 bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] rounded-lg text-sm hover:bg-[#E5E5EA]"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Resultados de búsqueda cercana */}
                    {nearbyResult && (
                        <div className="flex flex-col gap-0 px-5 py-4">
                            <p className="text-sm font-semibold text-[#1D1D1F] mb-3">
                                Resultados: <span className="text-[#E34234]">{nearbyResult.features.length}</span> tarea(s)
                            </p>
                            {nearbyResult.features.length === 0 ? (
                                <p className="text-xs text-[#6E6E73]">No se encontraron tareas en ese radio.</p>
                            ) : (
                                nearbyResult.features.map((f, i) => (
                                    <div
                                        key={i}
                                        className="mb-3 p-3 bg-[#F5F5F7] rounded-xl border border-[#D2D2D7]"
                                    >
                                        <p className="text-sm font-medium text-[#1D1D1F]">{f.properties.title}</p>
                                        {f.properties.description && (
                                            <p className="text-xs text-[#6E6E73] mt-1 line-clamp-2">
                                                {f.properties.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-[#0071E3] mt-1">
                                            📍 {f.geometry.coordinates[1].toFixed(4)}, {f.geometry.coordinates[0].toFixed(4)}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </aside>

                {/* Mapa */}
                <div ref={mapRef} className="flex-1" style={{ minHeight: "400px" }} />
            </div>
        </div>
    );
}
