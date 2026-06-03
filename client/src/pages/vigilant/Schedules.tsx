import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

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

type NewScheduleEntry = ScheduleEntry;

export default function Schedule() {
  const [showForm, setShowForm] =
    useState<boolean>(false);

  const [editMode, setEditMode] =
    useState<number | null>(null);

  const [editableName, setEditableName] =
    useState<string>("");

  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    createScheduleVigilant,
    getSchedules,
  } = useTask();

  const defaultScheduleData: ScheduleEntry[] = [
    {
      name: "Rodolfo Castro",
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
      domingo: "",
    },
    {
      name: "Francisco Hernandez",
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
      domingo: "",
    },
    {
      name: "Roberto Flores",
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
      domingo: "",
    },
    {
      name: "Vicente Fernandez",
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
      domingo: "",
    },
  ];

  const [scheduleData, setScheduleData] =
    useState<ScheduleEntry[]>(defaultScheduleData);

  const [newEntry, setNewEntry] =
    useState<NewScheduleEntry>({
      name: "",
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
      domingo: "",
    });

  const normalizeKey = (
    item: Partial<ScheduleEntry> | null | undefined
  ): string | null => {
    if (!item) return null;

    const raw = item._id ?? item.id ?? item.name;

    if (!raw) return null;

    return String(raw).trim().toLowerCase();
  };

  const dedupeByKey = (
    arr: ScheduleEntry[]
  ): ScheduleEntry[] => {
    const map = new Map<string, ScheduleEntry>();

    (arr || []).forEach((item) => {
      if (!item) return;

      const key =
        normalizeKey(item) ||
        `__no_key__${Math.random()
          .toString(36)
          .slice(2)}`;

      map.set(key, {
        ...(map.get(key) || {}),
        ...item,
      });
    });

    return Array.from(map.values());
  };

  const extractSchedules = (
    res: unknown
  ): ScheduleEntry[] => {
    let data: unknown = res;

    if (
      typeof data === "object" &&
      data !== null &&
      "data" in data
    ) {
      data = (data as { data?: unknown }).data;
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "schedules" in data
    ) {
      const schedules = (
        data as { schedules?: unknown }
      ).schedules;

      if (Array.isArray(schedules)) {
        return schedules as ScheduleEntry[];
      }
    }

    if (Array.isArray(data)) {
      return data as ScheduleEntry[];
    }

    if (
      typeof data === "object" &&
      data !== null
    ) {
      const arr = Object.values(data).find((v) =>
        Array.isArray(v)
      );

      if (Array.isArray(arr)) {
        return arr as ScheduleEntry[];
      }
    }

    return [];
  };

  useEffect(() => {
    void fetchSchedules();
  }, []);

  const fetchSchedules = async (): Promise<void> => {
    try {
      const res = await getSchedules();
      const data = extractSchedules(res);

      setScheduleData((prev) => {
        const combined = [...prev, ...data];
        const deduped = dedupeByKey(combined);

        return deduped.length
          ? deduped
          : prev.length
          ? prev
          : defaultScheduleData;
      });
    } catch (error: unknown) {
      console.error(
        "Error fetching schedules with getSchedules:",
        error
      );
    }
  };

  const handleSelectChange = (
    e: ChangeEvent<HTMLSelectElement>
  ): void => {
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
      (s) =>
        (s.name ?? "")
          .toString()
          .trim()
          .toLowerCase() ===
        selectedName
          .toString()
          .trim()
          .toLowerCase()
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;

    setNewEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEntry = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const timePattern =
      /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])\s*[-]?\s*([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;

    const isValidTime = (
      time: string
    ): boolean => {
      return (
        time === "" || timePattern.test(time)
      );
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
        text: "Por favor, ingresa un formato de tiempo válido para cada día (ej: 9:00 - 17:00).",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      await createScheduleVigilant(newEntry);

      // Como en tu contexto createScheduleVigilant
      // devuelve Promise<void>, recargamos desde backend
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
    } catch (error: unknown) {
      console.error(
        "Error al guardar el horario en la base de datos:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el horario.",
      });
    }
  };

  const enableEditMode = (
    index: number
  ): void => {
    setEditMode(index);
    setEditableName(scheduleData[index].name);
  };

  const handleNameChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setEditableName(e.target.value);
  };

  const saveNameChange = (
    index: number
  ): void => {
    const updatedData = [...scheduleData];
    updatedData[index].name = editableName;

    setScheduleData(updatedData);
    setEditMode(null);
  };

  const handleLogout = (): void => {
    logout();
    navigate("/");
  };

  const uniqueNamesForSelect: Array<
    [string, string]
  > = Array.from(
    scheduleData.reduce(
      (acc, row) => {
        if (!row || !row.name) return acc;

        const key = row.name
          .toString()
          .trim()
          .toLowerCase();

        if (!acc.has(key)) {
          acc.set(key, row.name);
        }

        return acc;
      },
      new Map<string, string>()
    )
  );

  return (
    <div className="schedule">
      <div className="schedule-content">
        <div className="add-schedule-wrapper">
          <div
            className="add-schedule"
            onClick={() => setShowForm(true)}
          >
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
                <label htmlFor="name">
                  Selecciona un vigilante
                </label>

                <select
                  id="name"
                  name="name"
                  value={newEntry.name}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="">
                    Selecciona un vigilante
                  </option>

                  {uniqueNamesForSelect.map(
                    ([key, name]) => (
                      <option
                        key={key}
                        value={name}
                      >
                        {name}
                      </option>
                    )
                  )}
                </select>

                <label htmlFor="lunes">
                  Lunes
                </label>
                <input
                  id="lunes"
                  type="text"
                  name="lunes"
                  placeholder="Ej: 9:00 - 17:00"
                  value={newEntry.lunes}
                  onChange={handleChange}
                />

                <label htmlFor="martes">
                  Martes
                </label>
                <input
                  id="martes"
                  type="text"
                  name="martes"
                  placeholder="Ej: 9:00 - 17:00"
                  value={newEntry.martes}
                  onChange={handleChange}
                />

                <label htmlFor="miercoles">
                  Miercoles
                </label>
                <input
                  id="miercoles"
                  type="text"
                  name="miercoles"
                  placeholder="Ej: 9:00 - 17:00"
                  value={newEntry.miercoles}
                  onChange={handleChange}
                />

                <label htmlFor="jueves">
                  Jueves
                </label>
                <input
                  id="jueves"
                  type="text"
                  name="jueves"
                  placeholder="Ej: 9:00 - 17:00"
                  value={newEntry.jueves}
                  onChange={handleChange}
                />

                <label htmlFor="viernes">
                  Viernes
                </label>
                <input
                  id="viernes"
                  type="text"
                  name="viernes"
                  placeholder="Ej: 9:00 - 17:00"
                  value={newEntry.viernes}
                  onChange={handleChange}
                />

                <label htmlFor="sabado">
                  Sabado
                </label>
                <input
                  id="sabado"
                  type="text"
                  name="sabado"
                  placeholder="Ej: 9:00 - 13:00"
                  value={newEntry.sabado}
                  onChange={handleChange}
                />

                <label htmlFor="domingo">
                  Domingo
                </label>
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

                  <button
                    type="submit"
                    className="create-button"
                  >
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
              <tr
                key={
                  row._id ??
                  row.id ??
                  `${row.name}-${index}`
                }
              >
                <td>
                  <div className="name-container">
                    <img
                      src={assets.usuario1}
                      alt="Editar"
                      onClick={() =>
                        enableEditMode(index)
                      }
                      className="edit-icon"
                    />

                    {editMode === index ? (
                      <input
                        type="text"
                        value={editableName}
                        onChange={handleNameChange}
                        onBlur={() =>
                          saveNameChange(index)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveNameChange(index);
                          }
                        }}
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