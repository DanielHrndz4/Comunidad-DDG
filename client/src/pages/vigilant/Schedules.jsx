import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useTask } from "../../context/TaskContext.jsx";
import assets from "../../assets";
import Swal from "sweetalert2";
import "./Schedules.css";

export default function Schedule() {
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(null);
    const [editableName, setEditableName] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const navigate = useNavigate();
    const { logout } = useAuth();
    const { createScheduleVigilant, getSchedules } = useTask();

    const defaultScheduleData = [
        { name: "Rodolfo Castro", lunes: "", martes: "", miercoles: "", jueves: "", viernes: "", sabado: "", domingo: "" },
        { name: "Francisco Hernandez", lunes: "", martes: "", miercoles: "", jueves: "", viernes: "", sabado: "", domingo: "" },
        { name: "Roberto Flores", lunes: "", martes: "", miercoles: "", jueves: "", viernes: "", sabado: "", domingo: "" },
        { name: "Vicente Fernandez", lunes: "", martes: "", miercoles: "", jueves: "", viernes: "", sabado: "", domingo: "" },
    ];

    const [scheduleData, setScheduleData] = useState(defaultScheduleData);

    const [newEntry, setNewEntry] = useState({
        name: "",
        lunes: "",
        martes: "",
        miercoles: "",
        jueves: "",
        viernes: "",
        sabado: "",
        domingo: "",
    });

    const normalizeKey = (item) => {
      if (!item) return null;
      const raw = item._id ?? item.id ?? item.name;
      if (!raw) return null;
      return String(raw).trim().toLowerCase();
    };

    const dedupeByKey = (arr) => {
      const map = new Map();
      (arr || []).forEach(item => {
        if (!item) return;
        const key = normalizeKey(item) || `__no_key__${Math.random().toString(36).slice(2)}`;
        map.set(key, { ...(map.get(key) || {}), ...item });
      });
      return Array.from(map.values());
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const res = await getSchedules();
            let data = res?.data?.schedules ?? res?.data ?? res ?? [];

            if (!Array.isArray(data) && typeof data === "object" && data !== null) {
                const arr = Object.values(data).find(v => Array.isArray(v));
                if (arr) data = arr;
                else data = [];
            }
            if (!Array.isArray(data)) data = [];

            setScheduleData(prev => {
                const combined = [...prev, ...data];
                const deduped = dedupeByKey(combined);
                return deduped.length ? deduped : (prev.length ? prev : defaultScheduleData);
            });
        } catch (error) {
            console.error("Error fetching schedules with getSchedules:", error);
        }
    };

    const handleSelectChange = (e) => {
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

        const existing = scheduleData.find(s => (s.name ?? "").toString().trim().toLowerCase() === selectedName.toString().trim().toLowerCase());
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
            setNewEntry(prev => ({ ...prev, name: selectedName }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    const handleAddEntry = async (e) => {
        e.preventDefault();

        const timePattern = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])\s*[-]?\s*([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
        const isValidTime = (time) => {
            return time === "" || timePattern.test(time);
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
                icon: 'error',
                title: 'Formato de hora inválido',
                text: 'Por favor, ingresa un formato de tiempo válido para cada día (ej: 9:00 - 17:00).',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        try {
            const res = await createScheduleVigilant(newEntry);
            console.log("createScheduleVigilant response:", res);

            const created = res?.data ?? res ?? null;

            let incoming = [];
            if (Array.isArray(created)) incoming = created;
            else if (created && typeof created === "object" && Array.isArray(created.schedules)) incoming = created.schedules;
            else if (created && typeof created === "object") incoming = [created];
            else incoming = [newEntry];

            setScheduleData(prev => {
                const combined = [...prev, ...incoming];
                const deduped = dedupeByKey(combined);
                return deduped.length ? deduped : prev;
            });

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
        } catch (error) {
            console.error("Error al guardar el horario en la base de datos:", error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar el horario.' });
        }
    };

    const enableEditMode = (index) => {
        setEditMode(index);
        setEditableName(scheduleData[index].name);
    };

    const handleNameChange = (e) => {
        setEditableName(e.target.value);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Enter") {
            saveNameChange(index);
        }
    };

    const saveNameChange = (index) => {
        const updatedData = [...scheduleData];
        updatedData[index].name = editableName;
        setScheduleData(updatedData);
        setEditMode(null);
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const uniqueNamesForSelect = Array.from(
        scheduleData.reduce((acc, row) => {
            if (!row || !row.name) return acc;
            const key = row.name.toString().trim().toLowerCase();
            if (!acc.has(key)) acc.set(key, row.name);
            return acc;
        }, new Map())
    );

    return (
        <div className="schedule">
            <div className="schedule-content">
                <div className="add-schedule-wrapper">
                    <div className="add-schedule" onClick={() => setShowForm(true)}>
                        <span>Agregar horario</span>
                        <img
                            src={assets.agregar}
                            alt="Agregar horario"
                            className="add-icon"
                        />
                    </div>
                </div>

                {showForm && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Crear Horario</h3>
                            <form onSubmit={handleAddEntry}>
                                <label htmlFor="name">Selecciona un vigilante</label>
                                <select
                                    id="name"
                                    name="name"
                                    value={newEntry.name}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    <option value="">Selecciona un vigilante</option>
                                    {uniqueNamesForSelect.map(([key, name]) => (
                                        <option key={key} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="lunes">Lunes</label>
                                <input
                                    id="lunes"
                                    type="text"
                                    name="lunes"
                                    placeholder="Ej: 9:00 - 17:00"
                                    value={newEntry.lunes}
                                    onChange={handleChange}
                                />

                                <label htmlFor="martes">Martes</label>
                                <input
                                    id="martes"
                                    type="text"
                                    name="martes"
                                    placeholder="Ej: 9:00 - 17:00"
                                    value={newEntry.martes}
                                    onChange={handleChange}
                                />

                                <label htmlFor="miercoles">Miercoles</label>
                                <input
                                    id="miercoles"
                                    type="text"
                                    name="miercoles"
                                    placeholder="Ej: 9:00 - 17:00"
                                    value={newEntry.miercoles}
                                    onChange={handleChange}
                                />

                                <label htmlFor="jueves">Jueves</label>
                                <input
                                    id="jueves"
                                    type="text"
                                    name="jueves"
                                    placeholder="Ej: 9:00 - 17:00"
                                    value={newEntry.jueves}
                                    onChange={handleChange}
                                />

                                <label htmlFor="viernes">Viernes</label>
                                <input
                                    id="viernes"
                                    type="text"
                                    name="viernes"
                                    placeholder="Ej: 9:00 - 17:00"
                                    value={newEntry.viernes}
                                    onChange={handleChange}
                                />

                                <label htmlFor="sabado">Sabado</label>
                                <input
                                    id="sabado"
                                    type="text"
                                    name="sabado"
                                    placeholder="Ej: 9:00 - 13:00"
                                    value={newEntry.sabado}
                                    onChange={handleChange}
                                />

                                <label htmlFor="domingo">Domingo</label>
                                <input
                                    id="domingo"
                                    type="text"
                                    name="domingo"
                                    placeholder="Ej: 9:00 - 13:00"
                                    value={newEntry.domingo}
                                    onChange={handleChange}
                                />

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() => {
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
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="create-button">
                                        Crear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <h3>Horarios Semanales de Vigilancia</h3>
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Lunes</th>
                            <th>Martes</th>
                            <th>Miercoles</th>
                            <th>Jueves</th>
                            <th>Viernes</th>
                            <th>Sabado</th>
                            <th>Domingo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleData.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="name-container">
                                        <img
                                            src={assets.usuario1}
                                            alt="Editar"
                                            onClick={() => enableEditMode(index)}
                                            className="edit-icon"
                                        />
                                        {editMode === index ? (
                                            <input
                                                type="text"
                                                value={editableName}
                                                onChange={handleNameChange}
                                                onBlur={() => saveNameChange(index)}
                                                onKeyDown={(e) => e.key === "Enter" && saveNameChange(index)}
                                                className="name-input"
                                                autoFocus
                                            />
                                        ) : (
                                            <span>{row.name}</span>
                                        )}
                                    </div>
                                </td>
                                <td>{row.lunes || "-"}</td>
                                <td>{row.martes || "-"}</td>
                                <td>{row.miercoles || "-"}</td>
                                <td>{row.jueves || "-"}</td>
                                <td>{row.viernes || "-"}</td>
                                <td>{row.sabado || "-"}</td>
                                <td>{row.domingo || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
