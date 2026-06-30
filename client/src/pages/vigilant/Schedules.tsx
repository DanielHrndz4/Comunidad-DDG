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
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editableName, setEditableName] = useState<string>("");
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([
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
  ]);

  const [newEntry, setNewEntry] = useState<NewScheduleEntry>({
    name: "",
    lunes: "",
    martes: "",
    miercoles: "",
    jueves: "",
    viernes: "",
    sabado: "",
    domingo: "",
  });

  const navigate = useNavigate();
  const { logout } = useAuth();
  const { createScheduleVigilant, getSchedules } = useTask();

  const normalizeKey = (item: Partial<ScheduleEntry> | null | undefined): string | null => {
    if (!item) return null;

    const raw = item._id ?? item.id ?? item.name;
    if (!raw) return null;

    return String(raw).trim().toLowerCase();
  };

  const dedupeByKey = (arr: ScheduleEntry[]): ScheduleEntry[] => {
    const map = new Map<string, ScheduleEntry>();

    arr.forEach((item) => {
      if (!item) return;

      const key = normalizeKey(item) || `__no_key__${Math.random().toString(36).slice(2)}`;
      map.set(key, { ...(map.get(key) || {}), ...item });
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

    if (Array.isArray(data)) {
      return data as ScheduleEntry[];
    }

    if (typeof data === "object" && data !== null) {
      const arr = Object.values(data).find((v) => Array.isArray(v));
      if (Array.isArray(arr)) return arr as ScheduleEntry[];
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
        return deduped.length ? deduped : prev.length ? prev : prev;
      });
    } catch (error: unknown) {
      console.error("Error fetching schedules with getSchedules:", error);
    }
  };

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
      (s) =>
        (s.name ?? "").toString().trim().toLowerCase() ===
        selectedName.toString().trim().toLowerCase()
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
      setNewEntry((prev) => ({ ...prev, name: selectedName }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEntry = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const timePattern = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])\s*[-]?\s*([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
    const isValidTime = (time: string): boolean => time === "" || timePattern.test(time);

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
      console.error("Error al guardar el horario en la base de datos:", error);
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

  const saveNameChange = (index: number): void => {
    const updatedData = [...scheduleData];
    updatedData[index].name = editableName;
    setScheduleData(updatedData);
    setEditMode(null);
  };

  const handleLogout = (): void => {
    logout();
    navigate("/");
  };

  const uniqueNamesForSelect: Array<[string, string]> = Array.from(
    scheduleData.reduce((acc, row) => {
      if (!row || !row.name) return acc;
      const key = row.name.toString().trim().toLowerCase();
      if (!acc.has(key)) {
        acc.set(key, row.name);
      }
      return acc;
    }, new Map<string, string>())
  );

  return (
    <div className="min-h-screen bg-[#030712] text-white px-6 py-10">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.4)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Horarios Semanales de Vigilancia</h1>
            <p className="mt-2 text-sm text-[#9ca3af]">Administra los turnos de los vigilantes y crea bloques de horario.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#3ecf8e] px-5 py-3 text-sm font-semibold text-[#050505] transition hover:bg-[#5fd9a6]"
            >
              <img src={assets.agregar} alt="Agregar horario" className="h-5 w-5" />
              Agregar horario
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white/10 bg-transparent px-5 py-3 text-sm text-[#cbd5e1] transition hover:border-[#3ecf8e] hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-6">
            <div className="w-full max-w-3xl rounded-[32px] bg-[#0f172a] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Crear Horario</h2>
                  <p className="mt-2 text-sm text-[#9ca3af]">Llena los horarios y asigna el vigilante correspondiente.</p>
                </div>
                <button
                  type="button"
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
                  className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-[#cbd5e1] transition hover:border-[#3ecf8e] hover:text-white"
                >
                  Cerrar
                </button>
              </div>

              <form onSubmit={handleAddEntry} className="space-y-5">
                <label className="block text-sm text-[#cbd5e1]">
                  <span className="mb-2 block">Selecciona un vigilante</span>
                  <select
                    id="name"
                    name="name"
                    value={newEntry.name}
                    onChange={handleSelectChange}
                    required
                    className="w-full rounded-3xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
                  >
                    <option value="">Selecciona un vigilante</option>
                    {uniqueNamesForSelect.map(([key, name]) => (
                      <option key={key} value={name}>{name}</option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["lunes", "Lunes"],
                    ["martes", "Martes"],
                    ["miercoles", "Miércoles"],
                    ["jueves", "Jueves"],
                    ["viernes", "Viernes"],
                    ["sabado", "Sábado"],
                    ["domingo", "Domingo"],
                  ].map(([field, label]) => (
                    <label key={field} className="block text-sm text-[#cbd5e1]">
                      <span className="mb-2 block">{label}</span>
                      <input
                        id={field}
                        type="text"
                        name={field}
                        placeholder="Ej: 9:00 - 17:00"
                        value={(newEntry as any)[field]}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
                      />
                    </label>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
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
                    className="rounded-full border border-white/10 bg-transparent px-5 py-3 text-sm text-[#cbd5e1] transition hover:border-[#3ecf8e] hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#3ecf8e] px-5 py-3 text-sm font-semibold text-[#050505] transition hover:bg-[#5fd9a6]"
                  >
                    Crear horario
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-[32px] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(15,23,42,0.4)]">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-[#111827]">
              <tr>
                {['Nombre', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((heading) => (
                  <th key={heading} className="px-4 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((row, index) => (
                <tr key={row._id ?? row.id ?? `${row.name}-${index}`} className="border-t border-white/10 last:border-b-0">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => enableEditMode(index)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-[#9ca3af] transition hover:bg-[#1f2937]"
                      >
                        ✎
                      </button>
                      {editMode === index ? (
                        <input
                          value={editableName}
                          onChange={handleNameChange}
                          onBlur={() => saveNameChange(index)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveNameChange(index);
                          }}
                          className="w-full rounded-3xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm text-white">{row.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#cbd5e1]">{row.lunes || "-"}</td>
                  <td className="px-4 py-4 text-sm text-[#cbd5e1]">{row.martes || "-"}</td>
                  <td className="px-4 py-4 text-sm text-[#cbd5e1]">{row.miercoles || "-"}</td>
                  <td className="px-4 py-4 text-sm text-[#cbd5e1]">{row.jueves || "-"}</td>
                  <td className="px-4 py-4 text-sm text-[#cbd5e1]">{row.viernes || "-"}</td>
                  <td className="px-4 py-4 text-sm text-[#cbd5e1]">{row.sabado || "-"}</td>
                  <td className="px-4 py-4 text-sm text-[#cbd5e1]">{row.domingo || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
