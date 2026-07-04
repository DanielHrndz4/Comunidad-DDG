import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import Swal from "sweetalert2";
import { MdLocationOn, MdUploadFile, MdClose } from "react-icons/md";
import { HiOutlineSpeakerphone } from "react-icons/hi";

import { ITaskAnnouncement } from "../../interfaces/ITaskAnnouncement";
import { createAnnouncement } from "../../services/task.service";
import { useAuth } from "../../context/AuthContext";
import MapPicker from "../ui/MapPicker";

import { getDelimitationData } from "../../utils/delimitationStore";

interface Props {
    close: () => void;
}

export default function CreateTaskForm({ close }: Props) {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm<ITaskAnnouncement>();

    const [imageBase64, setImageBase64] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string>("");
    const [imageError, setImageError] = useState<string>("");
    const [uploadAddress, setUploadAddress] = useState<string>("");

    const [geoLat, setGeoLat] = useState<string>(() => {
        const delim = getDelimitationData();
        return delim.lat.toString();
    });
    const [geoLng, setGeoLng] = useState<string>(() => {
        const delim = getDelimitationData();
        return delim.lng.toString();
    });
    const [skipLocation, setSkipLocation] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const titleValue = watch("title2") || "";
    const descriptionValue = watch("description2") || "";

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
        if (!valid.includes(file.type)) {
            setImageError("Formato inválido (JPG, PNG, GIF, WEBP)");
            return;
        }

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
        if (!navigator.geolocation) {
            Swal.fire("Geolocalización no disponible", "Usa el mapa interactivo para marcar el punto.", "warning");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setGeoLat(pos.coords.latitude.toFixed(6));
                setGeoLng(pos.coords.longitude.toFixed(6));
            },
            () => {
                Swal.fire("Error", "No se pudo obtener tu ubicación GPS actual. Por favor marca el punto directamente en el mapa.", "error");
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    const onSubmit = async (data: ITaskAnnouncement) => {
        if (!imageBase64) {
            setImageError("Debes seleccionar una imagen.");
            return;
        }
        setSubmitting(true);
        const lat = parseFloat(geoLat);
        const lng = parseFloat(geoLng);
        const hasCoords = !skipLocation && !isNaN(lat) && !isNaN(lng);

        const announcementData = {
            ...data,
            image: imageBase64,
            ...(hasCoords ? { location: { type: "Point" as const, coordinates: [lng, lat] as [number, number] } } : {}),
            ...(uploadAddress ? { uploadAddress } : {}),
        };

        try {
            await createAnnouncement(announcementData);

            Swal.fire({
                title: "¡Anuncio creado!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
            });

            navigate(isAdmin ? "/admin" : "/user");
            close();
        } catch {
            setSubmitting(false);
            Swal.fire({
                title: "Error",
                text: "No se pudo crear el anuncio.",
                icon: "error",
                confirmButtonColor: "#2dbda1",
            });
        }
    };

    return (
        <>
            <style>{`
                .ctf-root { background:#fff; border-radius:20px; width:100%; max-width:1050px; box-sizing:border-box; overflow:hidden; font-family:'Montserrat','Inter',sans-serif; box-shadow:0 20px 60px rgba(20,43,54,.18); }
                .ctf-header { background:linear-gradient(135deg,#2dbda1,#1a9e86); padding:22px 32px; display:flex; align-items:center; justify-content:space-between; }
                .ctf-header-left { display:flex; align-items:center; gap:14px; }
                .ctf-header h2 { color:#fff; font-size:19px; font-weight:700; margin:0; }
                .ctf-header p  { color:rgba(255,255,255,.75); font-size:11px; margin:3px 0 0; }
                .ctf-close { background:rgba(255,255,255,.2); border:none; border-radius:8px; color:#fff; cursor:pointer; display:flex; align-items:center; padding:7px; }
                .ctf-body { display:grid; grid-template-columns:1.3fr 0.7fr; width:100%; box-sizing:border-box; }
                @media(max-width:750px){ .ctf-body { grid-template-columns:1fr; } }
                .ctf-col { padding:26px 28px; display:flex; flex-direction:column; gap:18px; box-sizing:border-box; width:100%; }
                .ctf-col-left { border-right:1px solid #f0f0f5; }
                .ctf-section-label { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#2dbda1; margin:0; }
                .ctf-field { display:flex; flex-direction:column; gap:5px; width:100%; }
                .ctf-label { font-size:10px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; color:#6e6e73; }
                .ctf-input { width:100%; padding:11px 14px; border-radius:10px; border:1.5px solid #e5e5ea; font-size:14px; color:#142B36; background:#f9f9fb; outline:none; transition:border-color .2s; box-sizing:border-box; font-family:inherit; }
                .ctf-input:focus { border-color:#2dbda1; }
                .ctf-textarea { min-height:110px; resize:none; line-height:1.5; }
                .ctf-error { color:#e54a55; font-size:11px; margin:0; }
                .ctf-char-count { font-size:10px; color:#aaa; align-self:flex-end; }
                .ctf-skip-label { display:flex; align-items:center; gap:7px; font-size:12px; color:#6e6e73; cursor:pointer; }
                .ctf-coords-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
                .ctf-upload-label { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; border:2px dashed #d1d1d6; border-radius:14px; background:#fafafa; cursor:pointer; padding:20px 16px; text-align:center; transition:all .2s; }
                .ctf-upload-label.has-image { border-color:#2dbda1; background:#f0fdf9; }
                .ctf-upload-label span { font-size:12px; font-weight:600; color:#8c92ac; }
                .ctf-upload-label.has-image span { color:#2dbda1; }
                .ctf-preview { border-radius:14px; overflow:hidden; border:1.5px solid #e5e5ea; background:#fafafa; display:flex; align-items:center; justify-content:center; height:180px; }
                .ctf-preview img { width:100%; height:100%; object-fit:cover; display:block; }
                .ctf-preview-empty { font-size:12px; color:#d1d1d6; }
                .ctf-footer { padding:16px 32px 22px; display:flex; gap:10px; border-top:1px solid #f0f0f5; }
                .ctf-btn-cancel { flex:1; padding:12px; border-radius:10px; border:1.5px solid #e5e5ea; background:#fff; color:#142B36; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; }
                .ctf-btn-submit { flex:3; padding:12px; border-radius:10px; border:none; background:linear-gradient(135deg,#2dbda1,#1a9e86); color:#fff; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; box-shadow:0 4px 14px rgba(45,189,161,.35); letter-spacing:.3px; }
                .ctf-btn-submit:disabled, .ctf-btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }
                
                /* Custom Thin Scrollbar for popups/scrollers */
                ::-webkit-scrollbar { width:6px; height:6px; }
                ::-webkit-scrollbar-track { background:transparent; }
                ::-webkit-scrollbar-thumb { background:rgba(45,189,161,0.35); border-radius:10px; }
                ::-webkit-scrollbar-thumb:hover { background:rgba(45,189,161,0.55); }
                div[role="dialog"] { scrollbar-width:thin; scrollbar-color:rgba(45,189,161,0.35) transparent; }
            `}</style>

            <div className="ctf-root">
                {/* Header */}
                <div className="ctf-header">
                    <div className="ctf-header-left">
                        <MdLocationOn size={26} color="white" />
                        <div>
                            <h2>Nuevo Anuncio / Tarea</h2>
                            <p>Crea un nuevo anuncio informativo o tarea comunitaria geolocalizada</p>
                        </div>
                    </div>
                    <button className="ctf-close" onClick={close} type="button">
                        <MdClose size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "block", width: "100%" }}>
                    <div className="ctf-body">

                        {/* ══ LEFT: campos y geolocalización ══ */}
                        <div className="ctf-col ctf-col-left">
                            <p className="ctf-section-label">Información General</p>

                            {/* Título */}
                            <div className="ctf-field">
                                <label className="ctf-label">Título</label>
                                <input
                                    className="ctf-input"
                                    placeholder="¿Cuál es el título?"
                                    style={{ borderColor: errors.title2 ? "#e54a55" : titleValue.length >= 5 ? "#2dbda1" : undefined }}
                                    {...register("title2", {
                                        required: "El título es requerido",
                                        minLength: { value: 5, message: "Mínimo 5 caracteres" },
                                    })}
                                />
                                {errors.title2 && <p className="ctf-error">{errors.title2.message}</p>}
                            </div>

                            {/* Descripción */}
                            <div className="ctf-field">
                                <label className="ctf-label">Descripción</label>
                                <textarea
                                    className="ctf-input ctf-textarea"
                                    placeholder="Describe las instrucciones o detalles del anuncio..."
                                    maxLength={300}
                                    style={{
                                        borderColor: errors.description2 ? "#e54a55" : descriptionValue.length >= 10 ? "#2dbda1" : undefined,
                                    }}
                                    {...register("description2", {
                                        required: "La descripción es requerida",
                                        minLength: { value: 10, message: "Mínimo 10 caracteres" },
                                    })}
                                />
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    {errors.description2 ? <p className="ctf-error">{errors.description2.message}</p> : <span />}
                                    <span className="ctf-char-count">{descriptionValue.length}/300</span>
                                </div>
                            </div>
                        </div>

                        {/* ══ RIGHT: Imagen y Mapa ══ */}
                        <div className="ctf-col">
                            <p className="ctf-section-label">Multimedia y Ubicación</p>

                            {/* Imagen */}
                            <label htmlFor="ctf-img-input" className={`ctf-upload-label ${imageBase64 ? "has-image" : ""}`}>
                                <MdUploadFile size={26} color={imageBase64 ? "#2dbda1" : "#c7c7cc"} />
                                <span>{imageBase64 ? "Imagen cargada ✓" : "Sube una imagen ilustrativa"}</span>
                            </label>
                            <input id="ctf-img-input" type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleImageChange}
                                style={{ display: "none" }} />
                            {imageError && <p className="ctf-error">{imageError}</p>}

                            {imagePreview && (
                                <div className="ctf-preview">
                                    <img src={imagePreview} alt="Vista previa" />
                                </div>
                            )}

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

                            {/* Ubicación Mapa */}
                            <div className="ctf-field">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <label className="ctf-skip-label">
                                        <input type="checkbox" checked={skipLocation} style={{ accentColor: "#2dbda1" }}
                                            onChange={e => { setSkipLocation(e.target.checked); if (e.target.checked) { setGeoLat(""); setGeoLng(""); } }} />
                                        Sin ubicación (opcional)
                                    </label>
                                    {!skipLocation && (
                                        <button type="button" className="ctf-input" style={{ width: "auto", fontSize: "11px", padding: "4px 8px", cursor: "pointer" }} onClick={handleGetLocation}>
                                            📍 GPS
                                        </button>
                                    )}
                                </div>

                                {!skipLocation && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                                        <div className="ctf-coords-grid">
                                            <div className="ctf-field">
                                                <label className="ctf-label">Latitud</label>
                                                <input type="number" step="any" placeholder="13.6929" value={geoLat}
                                                    onChange={e => setGeoLat(e.target.value)}
                                                    className="ctf-input" />
                                            </div>
                                            <div className="ctf-field">
                                                <label className="ctf-label">Longitud</label>
                                                <input type="number" step="any" placeholder="-89.2182" value={geoLng}
                                                    onChange={e => setGeoLng(e.target.value)}
                                                    className="ctf-input" />
                                            </div>
                                        </div>

                                        <MapPicker lat={geoLat} lng={geoLng} onChange={(lat, lng) => { setGeoLat(lat); setGeoLng(lng); }} />
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="ctf-footer">
                        <button type="button" className="ctf-btn-cancel" onClick={close} disabled={submitting}>Cancelar</button>
                        <button type="submit" className="ctf-btn-submit" disabled={submitting}>
                            {submitting ? "Publicando..." : "Publicar Anuncio"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}