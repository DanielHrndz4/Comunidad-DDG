import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { MdLocationOn, MdRefresh, MdUploadFile, MdEditLocation, MdClose } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";

import { IReport } from "../../interfaces/IReport";
import { createReport } from "../../services/report.service";
import MapPicker from "../ui/MapPicker";

import { getDelimitationData } from "../../utils/delimitationStore";

interface ReportFormData {
    title: string;
    description: string;
    image: string;
    isDangerZone?: boolean;
}

interface Props {
    close: () => void;
}

type GeoStatus = "idle" | "loading" | "success" | "error";
type GeoMode = "auto" | "manual";

export default function CreateReportForm({ close }: Props) {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm<ReportFormData>();

    const [imageBase64, setImageBase64] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string>("");
    const [imageError, setImageError] = useState<string>("");
    const [uploadAddress, setUploadAddress] = useState<string>("");

    const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
    const [geoMode, setGeoMode] = useState<GeoMode>("auto");
    const [geoLat, setGeoLat] = useState<string>(() => {
        const delim = getDelimitationData();
        return delim.lat.toString();
    });
    const [geoLng, setGeoLng] = useState<string>(() => {
        const delim = getDelimitationData();
        return delim.lng.toString();
    });
    const [geoError, setGeoError] = useState<string>("");
    const [skipLocation, setSkipLocation] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const titleValue = watch("title") || "";
    const descriptionValue = watch("description") || "";

    // Silently get position + reverse-geocode when image is selected
    const captureUploadAddress = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const json = await res.json();
                    const addr = json?.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
                    setUploadAddress(addr);
                } catch {
                    setUploadAddress("");
                }
            },
            () => { setUploadAddress(""); },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const valid = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!valid.includes(file.type)) { setImageError("Formato inválido (JPG, PNG, GIF, WEBP)"); return; }
        
        // Capture the upload address whenever a photo is chosen
        captureUploadAddress();

        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const MAX_WIDTH = 1000;
                const MAX_HEIGHT = 1000;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
                    setImageBase64(compressedBase64);
                    setImagePreview(compressedBase64);
                    setValue("image", compressedBase64);
                    setImageError("");
                }
            };
        };
        reader.readAsDataURL(file);
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) { setGeoStatus("error"); setGeoError("Geolocalización no disponible. Usa la opción manual."); return; }
        setGeoStatus("loading"); setGeoError("");
        navigator.geolocation.getCurrentPosition(
            (pos) => { setGeoLat(pos.coords.latitude.toFixed(6)); setGeoLng(pos.coords.longitude.toFixed(6)); setGeoStatus("success"); },
            (err) => {
                const m: Record<number, string> = {
                    1: "Permiso denegado. Actívalo en 🔒 barra URL → Ubicación → Permitir.",
                    2: "Posición no disponible. Verifica tu GPS.", 3: "Tiempo agotado.",
                };
                setGeoStatus("error"); setGeoError(m[err.code] || "No se pudo obtener la ubicación.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const onSubmit = async (data: ReportFormData) => {
        if (!imageBase64) { setImageError("Debes seleccionar una imagen."); return; }
        setSubmitting(true);
        const lat = parseFloat(geoLat), lng = parseFloat(geoLng);
        const hasCoords = !skipLocation && !isNaN(lat) && !isNaN(lng) && geoLat && geoLng;
        const report: IReport = {
            ...data, image: imageBase64,
            ...(hasCoords ? { location: { type: "Point", coordinates: [lng, lat] } } : {}),
            ...(uploadAddress ? { uploadAddress } : {}),
            isDangerZone: !!data.isDangerZone,
        } as IReport;
        try {
            await createReport(report);
            Swal.fire({ title: "¡Reporte publicado!", icon: "success", timer: 2000, showConfirmButton: false, timerProgressBar: true });
            close();
        } catch (error: any) {
            setSubmitting(false);
            console.error("Create report error:", error);
            const serverMsg = error?.response?.data?.message || error?.message || "No se pudo enviar el reporte.";
            Swal.fire({ 
                title: "Error al publicar", 
                text: serverMsg, 
                icon: "error", 
                confirmButtonColor: "#2dbda1" 
            });
        }
    };

    return (
        <>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .crf-root { background:#fff; border-radius:20px; width:100%; box-sizing:border-box; overflow:hidden; font-family:'Montserrat','Inter',sans-serif; box-shadow:0 20px 60px rgba(20,43,54,.18); }
                .crf-header { background:linear-gradient(135deg,#2dbda1,#1a9e86); padding:22px 32px; display:flex; align-items:center; justify-content:space-between; }
                .crf-header-left { display:flex; align-items:center; gap:14px; }
                .crf-header h2 { color:#fff; font-size:19px; font-weight:700; margin:0; }
                .crf-header p  { color:rgba(255,255,255,.75); font-size:11px; margin:3px 0 0; }
                .crf-close { background:rgba(255,255,255,.2); border:none; border-radius:8px; color:#fff; cursor:pointer; display:flex; align-items:center; padding:7px; }
                .crf-body { display:grid; grid-template-columns:1.3fr 0.7fr; width:100%; box-sizing:border-box; }
                .crf-col { padding:26px 28px; display:flex; flex-direction:column; gap:18px; box-sizing:border-box; width:100%; }
                .crf-col-left { border-right:1px solid #f0f0f5; }
                .crf-section-label { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#2dbda1; margin:0; }
                .crf-field { display:flex; flex-direction:column; gap:5px; width:100%; }
                .crf-label { font-size:10px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; color:#6e6e73; }
                .crf-input { width:100%; padding:11px 14px; border-radius:10px; border:1.5px solid #e5e5ea; font-size:14px; color:#142B36; background:#f9f9fb; outline:none; transition:border-color .2s; box-sizing:border-box; font-family:inherit; }
                .crf-input:focus { border-color:#2dbda1; }
                .crf-textarea { min-height:120px; resize:none; line-height:1.5; }
                .crf-error { color:#e54a55; font-size:11px; margin:0; }
                .crf-char-count { font-size:10px; color:#aaa; align-self:flex-end; }
                .crf-geo-row { display:flex; align-items:center; justify-content:space-between; }
                .crf-ghost-btn { display:flex; align-items:center; gap:4px; padding:5px 10px; border-radius:7px; border:1px solid #e5e5ea; background:#fff; cursor:pointer; color:#2dbda1; font-size:11px; font-weight:600; font-family:inherit; }
                .crf-skip-label { display:flex; align-items:center; gap:7px; font-size:12px; color:#6e6e73; cursor:pointer; }
                .crf-gps-btn { display:flex; align-items:center; justify-content:center; gap:8px; padding:12px 16px; border-radius:10px; border:none; font-size:13px; font-weight:600; cursor:pointer; width:100%; font-family:inherit; transition:opacity .2s; }
                .crf-gps-btn-idle { background:#2dbda1; color:#fff; }
                .crf-gps-btn-loading { background:#f0f0f5; color:#8c92ac; cursor:not-allowed; }
                .crf-spin { width:13px; height:13px; border-radius:50%; border:2px solid #ccc; border-top-color:#2dbda1; display:inline-block; animation:spin .8s linear infinite; }
                .crf-geo-error { padding:12px 14px; background:#fff5f5; border:1.5px solid #ffcdd2; border-radius:10px; display:flex; flex-direction:column; gap:8px; }
                .crf-geo-error p { margin:0; font-size:11px; }
                .crf-geo-error-btns { display:flex; gap:8px; }
                .crf-geo-success { padding:11px 14px; background:#f0fdf9; border:1.5px solid #2dbda1; border-radius:10px; display:flex; align-items:center; justify-content:space-between; }
                .crf-geo-success-inner { display:flex; align-items:center; gap:8px; }
                .crf-geo-success p { margin:0; }
                .crf-coords-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
                .crf-tip { margin:0; font-size:10px; color:#8c92ac; grid-column:1/-1; }
                .crf-upload-label { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; border:2px dashed #d1d1d6; border-radius:14px; background:#fafafa; cursor:pointer; padding:24px 16px; text-align:center; transition:all .2s; }
                .crf-upload-label.has-image { border-color:#2dbda1; background:#f0fdf9; }
                .crf-upload-label span { font-size:13px; font-weight:600; color:#8c92ac; }
                .crf-upload-label.has-image span { color:#2dbda1; }
                .crf-upload-label small { font-size:10px; color:#c0c0c8; }
                .crf-preview { border-radius:14px; overflow:hidden; border:1.5px solid #e5e5ea; background:#fafafa; display:flex; align-items:center; justify-content:center; height:200px; }
                .crf-preview img { width:100%; height:100%; object-fit:cover; display:block; }
                .crf-preview-empty { font-size:12px; color:#d1d1d6; }
                .crf-footer { padding:16px 32px 22px; display:flex; gap:10px; border-top:1px solid #f0f0f5; }
                .crf-btn-cancel { flex:1; padding:12px; border-radius:10px; border:1.5px solid #e5e5ea; background:#fff; color:#142B36; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; }
                .crf-btn-submit { flex:3; padding:12px; border-radius:10px; border:none; background:linear-gradient(135deg,#2dbda1,#1a9e86); color:#fff; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; box-shadow:0 4px 14px rgba(45,189,161,.35); letter-spacing:.3px; }
                .crf-action-btn { display:flex; align-items:center; gap:4px; padding:6px 10px; border-radius:7px; border:none; font-size:11px; font-weight:600; cursor:pointer; font-family:inherit; }
                .crf-btn-submit:disabled, .crf-btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }
                
                /* Custom Thin Scrollbar for popups/scrollers */
                ::-webkit-scrollbar { width:6px; height:6px; }
                ::-webkit-scrollbar-track { background:transparent; }
                ::-webkit-scrollbar-thumb { background:rgba(45,189,161,0.35); border-radius:10px; }
                ::-webkit-scrollbar-thumb:hover { background:rgba(45,189,161,0.55); }
                div[role="dialog"] { scrollbar-width:thin; scrollbar-color:rgba(45,189,161,0.35) transparent; }
            `}</style>

            <div className="crf-root">
                {/* Header */}
                <div className="crf-header">
                    <div className="crf-header-left">
                        <HiDocumentReport size={26} color="white" />
                        <div>
                            <h2>Nuevo Reporte Comunitario</h2>
                            <p>Informa a la comunidad sobre un problema en tu zona</p>
                        </div>
                    </div>
                    <button className="crf-close" onClick={close} type="button">
                        <MdClose size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "block", width: "100%" }}>
                    <div className="crf-body">

                        {/* ══ LEFT: campos de texto ══ */}
                        <div className="crf-col crf-col-left">
                            <p className="crf-section-label">Información del reporte</p>

                            {/* Título */}
                            <div className="crf-field">
                                <label className="crf-label">Título</label>
                                <input
                                    className="crf-input"
                                    placeholder="¿Qué deseas reportar?"
                                    style={{ borderColor: errors.title ? "#e54a55" : titleValue.length >= 5 ? "#2dbda1" : undefined }}
                                    {...register("title", {
                                        required: "El título es requerido",
                                        minLength: { value: 5, message: "Mínimo 5 caracteres" },
                                    })}
                                />
                                {errors.title && <p className="crf-error">{errors.title.message}</p>}
                            </div>

                            {/* Descripción */}
                            <div className="crf-field" style={{ flex: 1 }}>
                                <label className="crf-label">Descripción</label>
                                <textarea
                                    className="crf-input crf-textarea"
                                    placeholder="Describe el problema con el mayor detalle posible..."
                                    maxLength={300}
                                    style={{
                                        flex: 1,
                                        borderColor: errors.description ? "#e54a55" : descriptionValue.length >= 10 ? "#2dbda1" : undefined,
                                    }}
                                    {...register("description", {
                                        required: "La descripción es requerida",
                                        minLength: { value: 10, message: "Mínimo 10 caracteres" },
                                    })}
                                />
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    {errors.description
                                        ? <p className="crf-error">{errors.description.message}</p>
                                        : <span />}
                                    <span className="crf-char-count">{descriptionValue.length}/300</span>
                                </div>
                            </div>

                            {/* Zona de peligro toggle */}
                            <div className="crf-field" style={{ margin: "5px 0" }}>
                                <label style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: "12px", 
                                    padding: "12px", 
                                    borderRadius: "10px", 
                                    background: watch("isDangerZone") ? "#fff5f5" : "#f9f9fb",
                                    border: watch("isDangerZone") ? "1.5px solid #e54a55" : "1.5px solid #e5e5ea",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}>
                                    <input 
                                        type="checkbox" 
                                        {...register("isDangerZone")} 
                                        style={{ accentColor: "#e54a55", width: "18px", height: "18px" }} 
                                    />
                                    <div>
                                        <span style={{ fontSize: "12px", fontWeight: 700, color: watch("isDangerZone") ? "#e54a55" : "#142B36", display: "block" }}>
                                            ⚠️ Marcar como Zona de Peligro / Calor
                                        </span>
                                        <span style={{ fontSize: "10px", color: "#8c92ac" }}>
                                            Se marcará la ubicación en rojo en el mapa para alertar de riesgos.
                                        </span>
                                    </div>
                                </label>
                            </div>

                            {/* Ubicación GPS */}
                            <div className="crf-field">
                                <div className="crf-geo-row">
                                    <label className="crf-label">Ubicación exacta (Mapa)</label>
                                    {!skipLocation && (
                                        <button type="button" className="crf-ghost-btn" onClick={handleGetLocation} disabled={geoStatus === "loading"}>
                                            <MdLocationOn size={13} />
                                            {geoStatus === "loading" ? "Obteniendo..." : "Mi Ubicación"}
                                        </button>
                                    )}
                                </div>

                                <label className="crf-skip-label" style={{ marginBottom: "8px" }}>
                                    <input type="checkbox" checked={skipLocation} style={{ accentColor: "#2dbda1" }}
                                        onChange={e => { setSkipLocation(e.target.checked); if (e.target.checked) { setGeoLat(""); setGeoLng(""); } }} />
                                    Sin ubicación (opcional)
                                </label>

                                {!skipLocation && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <div className="crf-coords-grid">
                                            <div className="crf-field">
                                                <label className="crf-label">Latitud</label>
                                                <input type="number" step="any" placeholder="13.6929" value={geoLat}
                                                    onChange={e => setGeoLat(e.target.value)}
                                                    className="crf-input"
                                                    style={{ borderColor: geoLat ? "#2dbda1" : undefined }} />
                                            </div>
                                            <div className="crf-field">
                                                <label className="crf-label">Longitud</label>
                                                <input type="number" step="any" placeholder="-89.2182" value={geoLng}
                                                    onChange={e => setGeoLng(e.target.value)}
                                                    className="crf-input"
                                                    style={{ borderColor: geoLng ? "#2dbda1" : undefined }} />
                                            </div>
                                        </div>

                                        <MapPicker 
                                            lat={geoLat} 
                                            lng={geoLng} 
                                            onChange={(lat, lng) => { setGeoLat(lat); setGeoLng(lng); }} 
                                            isDangerZone={watch("isDangerZone")} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ══ RIGHT: imagen ══ */}
                        <div className="crf-col">
                            <p className="crf-section-label">Imagen del reporte</p>

                            <label htmlFor="crf-img-input"
                                className={`crf-upload-label ${imageBase64 ? "has-image" : ""}`}>
                                <MdUploadFile size={32} color={imageBase64 ? "#2dbda1" : "#c7c7cc"} />
                                <span>{imageBase64 ? "Imagen seleccionada ✓" : "Haz clic para subir una imagen"}</span>
                                <small>JPG · PNG · GIF · WEBP</small>
                            </label>
                            <input id="crf-img-input" type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleImageChange}
                                style={{ display: "none" }} />
                            {imageError && <p className="crf-error">{imageError}</p>}

                            <div className="crf-preview">
                                {imagePreview
                                    ? <img src={imagePreview} alt="Vista previa" />
                                    : <span className="crf-preview-empty">Vista previa aquí</span>}
                            </div>

                            {uploadAddress && (
                                <div style={{
                                    background: "rgba(45,189,161,0.07)",
                                    border: "1px solid rgba(45,189,161,0.25)",
                                    borderRadius: "8px",
                                    padding: "7px 10px",
                                    fontSize: "10px",
                                    color: "#1a8571",
                                    lineHeight: "1.4",
                                    display: "flex",
                                    gap: "6px",
                                    alignItems: "flex-start",
                                }}>
                                    <span style={{ flexShrink: 0 }}>📍</span>
                                    <span>{uploadAddress}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="crf-footer">
                        <button type="button" className="crf-btn-cancel" onClick={close} disabled={submitting}>Cancelar</button>
                        <button type="submit" className="crf-btn-submit" disabled={submitting}>
                            {submitting ? "Publicando..." : "Publicar Reporte"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
