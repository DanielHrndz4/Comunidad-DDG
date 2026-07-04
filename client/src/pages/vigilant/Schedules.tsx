import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FiClock, FiPlus, FiUser, FiCalendar, FiEdit, FiX } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { useTask } from "../../context/TaskContext";
import assets from "../../assets";
import "./Schedules.css";

interface ScheduleEntry {
  _id?: string;
  id?: string;
  name: string;
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  sabado: string;
  domingo: string;
}

export default function Schedule() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editableName, setEditableName] = useState<string>("");

  const { getAdminUsers, getUsers } = useAuth();
  const { createScheduleVigilant, getSchedules } = useTask();

  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [newEntry, setNewEntry] = useState<ScheduleEntry>({
    name: "",
    lunes: "",
    martes: "",
    miercoles: "",
    jueves: "",
    viernes: "",
    sabado: "",
    domingo: "",
  });

  const normalizeKey = (item: Partial<ScheduleEntry> | null | undefined): string | null => {
    if (!item) return null;
    const raw = item._id ?? item.id ?? item.name;
    if (!raw) return null;
    return String(raw).trim().toLowerCase();
  };

  const dedupeByKey = (arr: ScheduleEntry[]): ScheduleEntry[] => {
    const map = new Map<string, ScheduleEntry>();
    (arr || []).forEach((item) => {
      if (!item) return;
      const key = normalizeKey(item) || `__no_key__${Math.random().toString(36).slice(2)}`;
      map.set(key, {
        ...(map.get(key) || {}),
        ...item,
      });
    });
    return Array.from(map.values());
  };

  const extractSchedules = (res: unknown): ScheduleEntry[] => {
    let data: unknown = res;
    if (typeof data === "object" && data !== null && "data" in data) {
      data = (data as { data?: unknown }).data;
    }
    if (typeof data === "object" && data !== null && "schedules" in data) {
      const schedules = (data as { schedules?: unknown }).schedules;
      if (Array.isArray(schedules)) return schedules as ScheduleEntry[];
    }
    if (Array.isArray(data)) return data as ScheduleEntry[];
    return [];
  };

  const fetchSchedules = async (): Promise<void> => {
    try {
      const res = await getSchedules();
      const data = extractSchedules(res);

      setScheduleData((prev) => {
        const combined = [...prev, ...data];
        const deduped = dedupeByKey(combined);
        return deduped.length ? deduped : prev;
      });
    } catch (error: unknown) {
      console.error("Error fetching schedules:", error);
    }
  };

  useEffect(() => {
    void fetchSchedules();
    void getUsers();
  }, []);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const selectedName = e.target.value;
    if (!selectedName) {
      setNewEntry({
        name: "",
        lunes: "",
        martes: "",
        miercoles: "",
        jueves: "",
        viernes: "",
        sabado: "",
        domingo: "",
      });
      return;
    }

    const existing = scheduleData.find(
      (s) => (s.name ?? "").toLowerCase().trim() === selectedName.toLowerCase().trim()
    );

    if (existing) {
      setNewEntry({
        name: existing.name ?? selectedName,
        lunes: existing.lunes ?? "",
        martes: existing.martes ?? "",
        miercoles: existing.miercoles ?? "",
        jueves: existing.jueves ?? "",
        viernes: existing.viernes ?? "",
        sabado: existing.sabado ?? "",
        domingo: existing.domingo ?? "",
      });
    } else {
      setNewEntry((prev) => ({
        ...prev,
        name: selectedName,
      }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEntry = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const timePattern = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])\s*[-]?\s*([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
    const isValidTime = (time: string): boolean => {
      const val = time.trim();
      return val === "" || val === "-" || timePattern.test(val);
    };

    if (
      !isValidTime(newEntry.lunes) ||
      !isValidTime(newEntry.martes) ||
      !isValidTime(newEntry.miercoles) ||
      !isValidTime(newEntry.jueves) ||
      !isValidTime(newEntry.viernes) ||
      !isValidTime(newEntry.sabado) ||
      !isValidTime(newEntry.domingo)
    ) {
      Swal.fire({
        icon: "error",
        title: "Formato de hora inválido",
        text: "Usa el formato de 24 horas (ej: 09:00-17:00 o 08:00 - 18:00) o déjalo vacío.",
        confirmButtonColor: "#e54a55",
      });
      return;
    }

    try {
      await createScheduleVigilant(newEntry);
      await fetchSchedules();
      setShowForm(false);
      setNewEntry({
        name: "",
        lunes: "",
        martes: "",
        miercoles: "",
        jueves: "",
        viernes: "",
        sabado: "",
        domingo: "",
      });

      Swal.fire({
        icon: "success",
        title: "¡Horario guardado!",
        text: "El horario semanal ha sido registrado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el horario.",
      });
    }
  };

  const enableEditMode = (index: number): void => {
    setEditMode(index);
    setEditableName(scheduleData[index].name);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEditableName(e.target.value);
  };

  const saveNameChange = async (index: number): Promise<void> => {
    const updatedData = [...scheduleData];
    const target = updatedData[index];
    target.name = editableName;
    setScheduleData(updatedData);
    setEditMode(null);

    try {
      await createScheduleVigilant(target);
    } catch (err) {
      console.error(err);
    }
  };

  // Compile list of vigilant guard names to show in select dropdown
  const allVigilantUsers = (getAdminUsers || []).filter((u) => u.role === "vigilant");
  const vigilantNamesFromUsers = allVigilantUsers.map((u) => u.name || u.username);

  // Combine with names already in schedules
  const allPossibleNames = Array.from(
    new Set([
      ...vigilantNamesFromUsers,
      ...scheduleData.map((s) => s.name),
    ])
  ).filter(Boolean);

  return (
    <div className="ddg-dash-wrapper">
      {/* Background decorations */}
      <div className="ddg-dash-bg-yellow" />
      <div className="ddg-dash-bg-red" />

      <div className="ddg-dash-content">
        {/* Header */}
        <div className="ddg-dash-header">
          <p className="ddg-dash-greeting">CALENDARIO DE TURNOS</p>
          <h1 className="ddg-dash-title">Horarios de Vigilancia</h1>
          <p className="ddg-dash-subtitle">
            Organización y cuadrantes de los vigilantes de la comunidad
          </p>
        </div>

        {/* Action Button Section */}
        <div className="schedule-action-bar">
          <button
            type="button"
            className="schedule-add-btn"
            onClick={() => setShowForm(true)}
          >
            <FiPlus size={18} />
            <span>Asignar Horario</span>
          </button>
        </div>

        {/* Schedule Table Container */}
        {scheduleData.length > 0 ? (
          <div className="schedule-table-card">
            <div className="schedule-table-wrapper">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Vigilante</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                    <th>Sábado</th>
                    <th>Domingo</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((row, index) => (
                    <tr key={row._id ?? row.id ?? `${row.name}-${index}`}>
                      <td className="guard-cell">
                        <div className="guard-cell-content">
                          <img
                            src={assets.usuario1}
                            alt="Avatar"
                            className="guard-avatar"
                          />
                          <div className="guard-info">
                            {editMode === index ? (
                              <input
                                type="text"
                                value={editableName}
                                onChange={handleNameChange}
                                onBlur={() => saveNameChange(index)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    saveNameChange(index);
                                  }
                                }}
                                className="guard-name-input"
                                autoFocus
                              />
                            ) : (
                              <span className="guard-name">{row.name}</span>
                            )}
                            <button
                              type="button"
                              className="guard-edit-btn"
                              onClick={() => enableEditMode(index)}
                              title="Editar nombre"
                            >
                              <FiEdit size={12} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`time-badge ${row.lunes ? "active" : "empty"}`}>
                          {row.lunes || "—"}
                        </span>
                      </td>
                      <td>
                        <span className={`time-badge ${row.martes ? "active" : "empty"}`}>
                          {row.martes || "—"}
                        </span>
                      </td>
                      <td>
                        <span className={`time-badge ${row.miercoles ? "active" : "empty"}`}>
                          {row.miercoles || "—"}
                        </span>
                      </td>
                      <td>
                        <span className={`time-badge ${row.jueves ? "active" : "empty"}`}>
                          {row.jueves || "—"}
                        </span>
                      </td>
                      <td>
                        <span className={`time-badge ${row.viernes ? "active" : "empty"}`}>
                          {row.viernes || "—"}
                        </span>
                      </td>
                      <td>
                        <span className={`time-badge ${row.sabado ? "active" : "empty"}`}>
                          {row.sabado || "—"}
                        </span>
                      </td>
                      <td>
                        <span className={`time-badge ${row.domingo ? "active" : "empty"}`}>
                          {row.domingo || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="empty-visits-state" style={{ width: "100%", maxWidth: "1000px" }}>
            <FiCalendar size={48} className="empty-icon" />
            <p className="empty-title">No hay horarios registrados</p>
            <p className="empty-desc">Haz clic en "Asignar Horario" para crear un cuadrante de vigilancia semanal</p>
          </div>
        )}

        {/* Add/Edit Schedule Modal */}
        {showForm && (
          <div className="schedule-modal-overlay">
            <div className="schedule-modal">
              <div className="schedule-modal-header">
                <h3>Asignar Horario Semanal</h3>
                <button
                  type="button"
                  className="schedule-modal-close"
                  onClick={() => setShowForm(false)}
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleAddEntry} className="schedule-modal-form">
                <div className="form-group-custom">
                  <label htmlFor="name">Vigilante / Guardia</label>
                  <div className="input-with-icon">
                    <FiUser className="field-icon" />
                    <select
                      id="name"
                      name="name"
                      value={newEntry.name}
                      onChange={handleSelectChange}
                      required
                    >
                      <option value="">Selecciona un vigilante</option>
                      {allPossibleNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="days-grid-form">
                  <div className="form-group-custom">
                    <label>Lunes</label>
                    <input
                      type="text"
                      name="lunes"
                      placeholder="Ej. 08:00 - 18:00"
                      value={newEntry.lunes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group-custom">
                    <label>Martes</label>
                    <input
                      type="text"
                      name="martes"
                      placeholder="Ej. 08:00 - 18:00"
                      value={newEntry.martes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group-custom">
                    <label>Miércoles</label>
                    <input
                      type="text"
                      name="miercoles"
                      placeholder="Ej. 08:00 - 18:00"
                      value={newEntry.miercoles}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group-custom">
                    <label>Jueves</label>
                    <input
                      type="text"
                      name="jueves"
                      placeholder="Ej. 08:00 - 18:00"
                      value={newEntry.jueves}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group-custom">
                    <label>Viernes</label>
                    <input
                      type="text"
                      name="viernes"
                      placeholder="Ej. 08:00 - 18:00"
                      value={newEntry.viernes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group-custom">
                    <label>Sábado</label>
                    <input
                      type="text"
                      name="sabado"
                      placeholder="Ej. 08:00 - 13:00"
                      value={newEntry.sabado}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group-custom">
                    <label>Domingo</label>
                    <input
                      type="text"
                      name="domingo"
                      placeholder="Ej. Descanso o -"
                      value={newEntry.domingo}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="schedule-modal-footer">
                  <button
                    type="button"
                    className="schedule-btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="schedule-btn-primary">
                    Guardar Horario
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}