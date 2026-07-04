import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { MdLocationOn, MdClose } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";

import { IReport } from "../../interfaces/IReport";
import { useTask } from "../../context/TaskContext";
import MapPicker from "../ui/MapPicker";

interface Props {
    report: IReport & { _id: string };
    close: () => void;
}

export default function UpdateReportForm({
    report,
    close,
}: Props) {
    const { updateTask } = useTask();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<IReport>({
        defaultValues: {
            title: report?.title ?? "",
            description: report?.description ?? "",
        },
    });

    const [geoLat, setGeoLat] = useState<string>(
        report?.location?.coordinates ? report.location.coordinates[1].toString() : ""
    );
    const [geoLng, setGeoLng] = useState<string>(
        report?.location?.coordinates ? report.location.coordinates[0].toString() : ""
    );
    const [skipLocation, setSkipLocation] = useState<boolean>(!report?.location);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const titleValue = watch("title") || "";
    const descriptionValue = watch("description") || "";

    const onSubmit = async (data: IReport) => {
        setSubmitting(true);
        const lat = parseFloat(geoLat);
        const lng = parseFloat(geoLng);
        const hasCoords = !skipLocation && !isNaN(lat) && !isNaN(lng);

        const updatedReport = {
            ...data,
            location: hasCoords ? { type: "Point" as const, coordinates: [lng, lat] as [number, number] } : undefined,
        };

        try {
            await updateTask(report._id, updatedReport);

            Swal.fire({
                text: "Tu publicación se ha actualizado correctamente.",
                icon: "success",
                confirmButtonColor: "#2dbda1",
                confirmButtonText: "Aceptar",
                timer: 2000,
                timerProgressBar: true,
            }).then(() => {
                close();
            });
        } catch (error: any) {
            setSubmitting(false);
            console.error("Update report error:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar la publicación.",
                icon: "error",
                confirmButtonColor: "#dc2626",
            });
        }
    };

    return (
        <>
            <style>{`
                .urf-root { background:#fff; border-radius:20px; width:100%; max-width:1050px; box-sizing:border-box; overflow:hidden; font-family:'Montserrat','Inter',sans-serif; box-shadow:0 20px 60px rgba(20,43,54,.18); }
                .urf-header { background:linear-gradient(135deg,#2dbda1,#1a9e86); padding:22px 32px; display:flex; align-items:center; justify-content:space-between; }
                .urf-header-left { display:flex; align-items:center; gap:14px; }
                .urf-header h2 { color:#fff; font-size:19px; font-weight:700; margin:0; }
                .urf-header p  { color:rgba(255,255,255,.75); font-size:11px; margin:3px 0 0; }
                .urf-close { background:rgba(255,255,255,.2); border:none; border-radius:8px; color:#fff; cursor:pointer; display:flex; align-items:center; padding:7px; }
                .urf-body { display:grid; grid-template-columns:1.3fr 0.7fr; width:100%; box-sizing:border-box; }
                @media(max-width:750px){ .urf-body { grid-template-columns:1fr; } }
                .urf-col { padding:26px 28px; display:flex; flex-direction:column; gap:18px; box-sizing:border-box; width:100%; }
                .urf-col-left { border-right:1px solid #f0f0f5; }
                .urf-section-label { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#2dbda1; margin:0; }
                .urf-field { display:flex; flex-direction:column; gap:5px; width:100%; }
                .urf-label { font-size:10px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; color:#6e6e73; }
                .urf-input { width:100%; padding:11px 14px; border-radius:10px; border:1.5px solid #e5e5ea; font-size:14px; color:#142B36; background:#f9f9fb; outline:none; transition:border-color .2s; box-sizing:border-box; font-family:inherit; }
                .urf-input:focus { border-color:#2dbda1; }
                .urf-textarea { min-height:110px; resize:none; line-height:1.5; }
                .urf-error { color:#e54a55; font-size:11px; margin:0; }
                .urf-char-count { font-size:10px; color:#aaa; align-self:flex-end; }
                .urf-skip-label { display:flex; align-items:center; gap:7px; font-size:12px; color:#6e6e73; cursor:pointer; }
                .urf-coords-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
                .urf-preview { border-radius:14px; overflow:hidden; border:1.5px solid #e5e5ea; background:#fafafa; display:flex; align-items:center; justify-content:center; height:180px; }
                .urf-preview img { width:100%; height:100%; object-fit:cover; display:block; }
                .urf-footer { padding:16px 32px 22px; display:flex; gap:10px; border-top:1px solid #f0f0f5; }
                .urf-btn-cancel { flex:1; padding:12px; border-radius:10px; border:1.5px solid #e5e5ea; background:#fff; color:#142B36; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; }
                .urf-btn-submit { flex:3; padding:12px; border-radius:10px; border:none; background:linear-gradient(135deg,#2dbda1,#1a9e86); color:#fff; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; box-shadow:0 4px 14px rgba(45,189,161,.35); letter-spacing:.3px; }
                .urf-btn-submit:disabled, .urf-btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }
                
                /* Custom Thin Scrollbar for popups/scrollers */
                ::-webkit-scrollbar { width:6px; height:6px; }
                ::-webkit-scrollbar-track { background:transparent; }
                ::-webkit-scrollbar-thumb { background:rgba(45,189,161,0.35); border-radius:10px; }
                ::-webkit-scrollbar-thumb:hover { background:rgba(45,189,161,0.55); }
                div[role="dialog"] { scrollbar-width:thin; scrollbar-color:rgba(45,189,161,0.35) transparent; }
            `}</style>

            <div className="urf-root">
                {/* Header */}
                <div className="urf-header">
                    <div className="urf-header-left">
                        <HiDocumentReport size={26} color="white" />
                        <div>
                            <h2>Actualizar Reporte</h2>
                            <p>Modifica la información o posición en el mapa del reporte</p>
                        </div>
                    </div>
                    <button className="urf-close" onClick={close} type="button">
                        <MdClose size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "block", width: "100%" }}>
                    <div className="urf-body">

                        {/* ══ LEFT: campos de texto y ubicación ══ */}
                        <div className="urf-col urf-col-left">
                            <p className="urf-section-label">Detalles del reporte</p>

                            {/* Título */}
                            <div className="urf-field">
                                <label className="urf-label">Título</label>
                                <input
                                    className="urf-input"
                                    placeholder="Ingrese el título"
                                    style={{ borderColor: errors.title ? "#e54a55" : titleValue.length >= 3 ? "#2dbda1" : undefined }}
                                    {...register("title", {
                                        required: "El título es requerido",
                                        minLength: { value: 3, message: "Mínimo 3 caracteres" },
                                    })}
                                />
                                {errors.title && <p className="urf-error">{errors.title.message}</p>}
                            </div>

                            {/* Descripción */}
                            <div className="urf-field">
                                <label className="urf-label">Descripción</label>
                                <textarea
                                    className="urf-input urf-textarea"
                                    placeholder="Ingrese la descripción..."
                                    maxLength={300}
                                    style={{
                                        borderColor: errors.description ? "#e54a55" : descriptionValue.length >= 10 ? "#2dbda1" : undefined,
                                    }}
                                    {...register("description", {
                                        required: "La descripción es requerida",
                                        minLength: { value: 10, message: "Mínimo 10 caracteres" },
                                    })}
                                />
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    {errors.description ? <p className="urf-error">{errors.description.message}</p> : <span />}
                                    <span className="urf-char-count">{descriptionValue.length}/300</span>
                                </div>
                            </div>
                        </div>

                        {/* ══ RIGHT: Mapa y previsualización de imagen ══ */}
                        <div className="urf-col">
                            <p className="urf-section-label">Ubicación y Evidencia</p>

                            {/* Evidencia Imagen */}
                            {report.image && (
                                <div className="urf-preview" style={{ minHeight: "150px", maxHeight: "150px" }}>
                                    <img src={report.image} alt="Evidencia actual" />
                                </div>
                            )}

                            {/* Ubicación Mapa */}
                            <div className="urf-field">
                                <label className="urf-skip-label">
                                    <input type="checkbox" checked={skipLocation} style={{ accentColor: "#2dbda1" }}
                                        onChange={e => { setSkipLocation(e.target.checked); if (e.target.checked) { setGeoLat(""); setGeoLng(""); } }} />
                                    Sin ubicación geográfica
                                </label>

                                {!skipLocation && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                                        <div className="urf-coords-grid">
                                            <div className="urf-field">
                                                <label className="urf-label">Latitud</label>
                                                <input type="number" step="any" placeholder="13.6929" value={geoLat}
                                                    onChange={e => setGeoLat(e.target.value)}
                                                    className="urf-input" />
                                            </div>
                                            <div className="urf-field">
                                                <label className="urf-label">Longitud</label>
                                                <input type="number" step="any" placeholder="-89.2182" value={geoLng}
                                                    onChange={e => setGeoLng(e.target.value)}
                                                    className="urf-input" />
                                            </div>
                                        </div>

                                        <MapPicker lat={geoLat} lng={geoLng} onChange={(lat, lng) => { setGeoLat(lat); setGeoLng(lng); }} />
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="urf-footer">
                        <button type="button" className="urf-btn-cancel" onClick={close} disabled={submitting}>Cancelar</button>
                        <button type="submit" className="urf-btn-submit" disabled={submitting}>
                            {submitting ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}