import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { FiCalendar, FiMapPin, FiX } from "react-icons/fi";
import Popup from "reactjs-popup";
import Swal from "sweetalert2";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import UpadteTaskForm from "../forms/UpdateTaskForm";
import { useTask } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import "./ListPages.css";

interface TaskItem {
  _id: string;
  title2: string;
  description2: string;
  date2: string;
  user: string;
  image: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  uploadAddress?: string;
}

interface TaskTableProps {
  tasks: TaskItem[];
}

interface TaskDetailViewProps {
  task: TaskItem;
  close: () => void;
}

function TaskDetailView({ task, close }: TaskDetailViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const [lng, lat] = task.location?.coordinates || [];
  const isValidLat = typeof lat === "number" && !isNaN(lat);
  const isValidLng = typeof lng === "number" && !isNaN(lng);
  const hasCoords = task.location?.coordinates && task.location.coordinates.length === 2 && isValidLat && isValidLng;

  useEffect(() => {
    if (!hasCoords) return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;
      const [lng, lat] = task.location!.coordinates;

      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const markerIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      L.marker([lat, lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(`<b>${task.title2}</b>`);

      mapRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [task, hasCoords]);

  return (
    <div style={{ background: "#ffffff", borderRadius: "24px", overflow: "hidden", fontFamily: "'Montserrat', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #142B36, #1f3d4c)",
        padding: "20px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#ffffff"
      }}>
        <div>
          <span style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            background: "rgba(255, 255, 255, 0.2)",
            padding: "4px 8px",
            borderRadius: "6px",
            display: "inline-block",
            marginBottom: "6px"
          }}>
            Anuncio Oficial
          </span>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>{task.title2}</h2>
        </div>
        <button onClick={close} style={{
          background: "rgba(255, 255, 255, 0.15)",
          border: "none",
          color: "#ffffff",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s"
        }}>
          <FiX size={20} />
        </button>
      </div>

      {/* Body Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        width: "100%",
        boxSizing: "border-box"
      }} className="report-detail-layout">
        {/* Left Column: Info */}
        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px", borderRight: "1px solid #f0f0f5" }}>
          {/* Metadata Row */}
          <div style={{ display: "flex", gap: "16px", color: "#6e6e73", fontSize: "13px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FiCalendar />
              <span>{new Date(task.date2).toLocaleString()}</span>
            </div>
            {task.user && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>Administrador ID: {task.user.slice(-5)}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: 700, color: "#142B36", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Descripción
            </h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#4a4a4f", lineHeight: "1.6", whiteSpace: "pre-line" }}>
              {task.description2}
            </p>
          </div>

          {/* Address / Location Details */}
          {(task.uploadAddress || hasCoords) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h4 style={{ margin: "0", fontSize: "12px", fontWeight: 700, color: "#142B36", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Ubicación Relacionada
              </h4>
              {task.uploadAddress && (
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "13px", color: "#4a4a4f" }}>
                  <FiMapPin size={16} style={{ color: "#2dbda1", flexShrink: 0, marginTop: "2px" }} />
                  <span>{task.uploadAddress}</span>
                </div>
              )}

              {/* Leaflet Mini Map */}
              {hasCoords ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div ref={mapContainerRef} style={{ width: "100%", height: "200px", borderRadius: "14px", overflow: "hidden", border: "1.5px solid rgba(20, 43, 54, 0.08)" }} />
                  <span style={{ fontSize: "10px", color: "#8c92ac" }}>
                    Coordenadas: {task.location.coordinates[1].toFixed(6)}, {task.location.coordinates[0].toFixed(6)}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: "12px", color: "#8c92ac", fontStyle: "italic" }}>
                  Sin geolocalización en mapa.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Image Preview */}
        <div style={{ background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", maxHeight: "600px" }}>
          {task.image ? (
            <img src={task.image} alt={task.title2} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "14px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} />
          ) : (
            <span style={{ color: "#8c92ac", fontSize: "13px" }}>Sin imagen disponible</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TaskTable({ tasks }: TaskTableProps) {
  const { deleteTask2, getTaskAdmin2 } = useTask();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const [editing, editTask] = useState<TaskItem | null>(null);
  const [viewingDetail, setViewingDetail] = useState<TaskItem | null>(null);

  const closePopup = (): void => {
    editTask(null);
    getTaskAdmin2();
  };
  const closeDetailPopup = (): void => setViewingDetail(null);

  return (
    <div className="ddg-list-container">
      <div className="ddg-card-grid">
        {tasks?.length > 0 ? (
          tasks.map((i) => (
            <div key={i._id} className="ddg-premium-card" style={{ display: "flex", flexDirection: "column" }}>
              {/* Image Header */}
              {i.image && (
                <div className="ddg-card-image-wrapper" style={{ cursor: "pointer" }} onClick={() => setViewingDetail(i)}>
                  <img
                    src={i.image}
                    alt={i.title2}
                    className="ddg-card-image"
                  />
                  <div className="ddg-card-badge">
                    {new Date(i.date2).toLocaleDateString()}
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="ddg-card-content" style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div className="ddg-card-main-info" style={{ cursor: "pointer" }} onClick={() => setViewingDetail(i)}>
                  <span className="ddg-card-meta">Anuncio Oficial</span>
                  <h3 className="ddg-card-title">{i.title2}</h3>
                  <p className="ddg-card-description">{i.description2}</p>
                </div>

                <div className="ddg-card-footer">
                  <div className="ddg-user-pill" style={{ cursor: "pointer" }} onClick={() => setViewingDetail(i)}>
                    <div className="ddg-user-avatar">A</div>
                    <span>ID: {i.user?.slice(-5) || "Admin"}</span>
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => setViewingDetail(i)}
                      style={{
                        background: "rgba(20, 43, 54, 0.05)",
                        border: "none",
                        color: "#142B36",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit"
                      }}
                    >
                      Ver Amplio
                    </button>

                    {isAdmin && (
                      <div className="ddg-card-actions" style={{ marginLeft: "4px" }}>
                        <button
                          type="button"
                          className="ddg-btn-icon ddg-btn-edit"
                          onClick={() => editTask(i)}
                          title="Editar Anuncio"
                        >
                          <MdModeEdit />
                        </button>

                        <button
                          type="button"
                          className="ddg-btn-icon ddg-btn-delete"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const confirm = await Swal.fire({
                              title: "¿Eliminar anuncio?",
                              text: "Esta acción no se puede deshacer.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#3085d6",
                              confirmButtonText: "Sí, eliminar",
                              cancelButtonText: "Cancelar",
                            });

                            if (confirm.isConfirmed) {
                              try {
                                await deleteTask2(i._id);

                                await Swal.fire({
                                  title: "Eliminado",
                                  text: "El anuncio se ha eliminado correctamente.",
                                  icon: "success",
                                  showConfirmButton: false,
                                  timer: 1500,
                                  timerProgressBar: true,
                                });

                                await new Promise((resolve) =>
                                  setTimeout(resolve, 500)
                                );

                                navigate("/admin");
                              } catch (err) {
                                console.error(err);
                                Swal.fire({
                                  title: "Error",
                                  text: "Ocurrió un error al eliminar el anuncio.",
                                  icon: "error",
                                  confirmButtonColor: "#d33",
                                });
                              }
                            }
                          }}
                          title="Eliminar Anuncio"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", gridColumn: "1/-1", padding: "40px", color: "#8c92ac" }}>
            No hay anuncios oficiales publicados en este momento.
          </div>
        )}
      </div>

      {/* Edit Form Popup */}
      <Popup
        open={editing !== null}
        onClose={closePopup}
        lockScroll={true}
        position="top center"
        closeOnDocumentClick={false}
        modal={true}
        overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
        contentStyle={{
          maxHeight: "95vh",
          overflow: "auto",
          maxWidth: "1050px",
          width: "95vw",
          borderRadius: "24px",
          padding: "0",
          border: "none",
          background: "transparent",
        }}
      >
        {editing && (
          <UpadteTaskForm
            task={editing}
            close={closePopup}
          />
        )}
      </Popup>

      {/* Detail View Popup */}
      <Popup
        open={viewingDetail !== null}
        onClose={closeDetailPopup}
        lockScroll={true}
        position="top center"
        closeOnDocumentClick={false}
        modal={true}
        overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
        contentStyle={{
          maxHeight: "95vh",
          overflow: "auto",
          maxWidth: "1050px",
          width: "95vw",
          borderRadius: "24px",
          padding: "0",
          border: "none",
          background: "transparent",
        }}
      >
        {viewingDetail && (
          <TaskDetailView
            task={viewingDetail}
            close={closeDetailPopup}
          />
        )}
      </Popup>
    </div>
  );
}