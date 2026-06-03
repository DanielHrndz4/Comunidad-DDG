import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { useAuth } from "../../context/AuthContext";
import type { IUser } from "../../interfaces/IUser";

interface ProfileUpdateFormData {
  name: string;
  username: string;
  email: string;
  password?: string;
  telephone: string;
  age: number;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#1c1c1c",
  border: "1px solid #2e2e2e",
  borderRadius: "6px",
  padding: "9px 14px",
  color: "#ededed",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

export default function Profile() {
  const { user, updateProfile, updatePasswordByPassword } = useAuth();
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm<ProfileUpdateFormData>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        username: user.username,
        email: user.email,
        password: "",
        telephone: user.telephone,
        age: user.age,
      });
    }
  }, [user, reset]);

  if (!user) {
    return (
      <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <p style={{ color: "#8b8b8b", fontSize: "14px" }}>Cargando perfil...</p>
      </main>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  const onSubmit = async (data: ProfileUpdateFormData) => {
    const payload: Partial<IUser> = { ...data };
    const newPassword = payload.password?.trim();
    
    delete payload.password; // Remove from standard profile update payload

    const userId = user.id ?? user._id;
    if (!userId) {
      Swal.fire({ title: "Error", text: "No se encontró el ID del usuario.", icon: "error", background: "#1c1c1c", color: "#ededed" });
      return;
    }

    try {
      // 1. Si el usuario ingresó contraseña, actualizarla primero mediante su endpoint específico
      if (newPassword && newPassword !== "") {
        await updatePasswordByPassword({ username: data.username, password: newPassword });
      }

      // 2. Actualizar el resto del perfil
      await updateProfile(userId, payload);
      
      await Swal.fire({
        title: "¡Actualizado!", text: "Datos guardados correctamente.", icon: "success",
        background: "#1c1c1c", color: "#ededed", confirmButtonColor: "#3ecf8e",
        showConfirmButton: false, timer: 2000,
      });
      setEditing(false);
    } catch {
      Swal.fire({ title: "Error", text: "No se pudo actualizar la información.", icon: "error", background: "#1c1c1c", color: "#ededed", confirmButtonColor: "#ef4444" });
    }
  };

  const viewFields = [
    { label: "Nombre completo", value: user.name, icon: "👤" },
    { label: "Username",        value: user.username, icon: "🔑" },
    { label: "Email",           value: user.email, icon: "✉️" },
    { label: "Teléfono",        value: user.telephone || "—", icon: "📱" },
    { label: "Edad",            value: user.age ? `${user.age} años` : "—", icon: "🎂" },
  ];

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 24px 80px", boxSizing: "border-box", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: "1000px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "white", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>Mi Perfil</h1>
          <p style={{ color: "#8b8b8b", fontSize: "15px", margin: 0 }}>Gestiona tu información personal.</p>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#3ecf8e", color: "#050505", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#2bbd7a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#3ecf8e"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar perfil
          </button>
        )}
      </div>

      <div style={{ width: "100%", maxWidth: "1000px", display: "grid", gridTemplateColumns: "300px 1fr", gap: "32px", alignItems: "start" }}>

        {/* ── Col izquierda: Avatar ── */}
        <div style={{ backgroundColor: "#141414", border: "1px solid #2e2e2e", borderRadius: "12px", padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "linear-gradient(135deg, #3ecf8e 0%, #1a9e6e 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", fontWeight: "700", color: "#050505", boxShadow: "0 0 0 6px rgba(62,207,142,0.12)" }}>
            {initials}
          </div>

          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <div style={{ color: "#ededed", fontWeight: "600", fontSize: "20px", marginBottom: "8px" }}>{user.name}</div>
            <div style={{ display: "inline-block", backgroundColor: "rgba(62,207,142,0.1)", color: "#3ecf8e", border: "1px solid rgba(62,207,142,0.2)", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              {user.role === "normal" ? "Usuario" : user.role}
            </div>
          </div>

          <div style={{ width: "100%", borderTop: "1px solid #2e2e2e", margin: "8px 0" }} />
          <div style={{ width: "100%", textAlign: "center" }}>
            <div style={{ color: "#8b8b8b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: "500" }}>Email</div>
            <div style={{ color: "#a1a1aa", fontSize: "14px", wordBreak: "break-all" }}>{user.email}</div>
          </div>
        </div>

        {/* ── Col derecha: Vista o Edición ── */}
        <div style={{ backgroundColor: "#141414", border: "1px solid #2e2e2e", borderRadius: "12px", overflow: "hidden" }}>

          {/* Cabecera */}
          <div style={{ padding: "20px 28px", borderBottom: "1px solid #2e2e2e", backgroundColor: "#1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ color: "#ededed", fontSize: "16px", fontWeight: "600", margin: 0 }}>
              {editing ? "Editar información" : "Información de la cuenta"}
            </h2>
            {editing && (
              <button onClick={() => { setEditing(false); reset(); }}
                style={{ background: "transparent", color: "#8b8b8b", border: "1px solid #2e2e2e", borderRadius: "8px", padding: "6px 16px", fontSize: "13px", fontWeight: "500", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#ededed"; e.currentTarget.style.borderColor = "#555"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#8b8b8b"; e.currentTarget.style.borderColor = "#2e2e2e"; }}
              >
                Cancelar
              </button>
            )}
          </div>

          {/* ── MODO VISTA ── */}
          {!editing && (
            <div style={{ padding: "8px 0" }}>
              {viewFields.map((field, idx) => (
                <div
                  key={idx}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px", borderBottom: idx < viewFields.length - 1 ? "1px solid #1f1f1f" : "none", transition: "background 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1c1c1c"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "18px" }}>{field.icon}</span>
                    <span style={{ color: "#8b8b8b", fontSize: "14px", fontWeight: "500" }}>{field.label}</span>
                  </div>
                  <span style={{ color: "#ededed", fontSize: "15px", fontWeight: "500" }}>{field.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── MODO EDICIÓN ── */}
          {editing && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px", background: "transparent", margin: 0, boxShadow: "none" }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", color: "#8b8b8b", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Nombre completo</label>
                  <input type="text" {...register("name", { required: true })} style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#3ecf8e"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#2e2e2e"} />
                </div>
                <div>
                  <label style={{ display: "block", color: "#8b8b8b", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Username</label>
                  <input type="text" {...register("username", { required: true })} style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#3ecf8e"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#2e2e2e"} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "#8b8b8b", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Email</label>
                <input type="email" {...register("email", { required: true })} style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#3ecf8e"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#2e2e2e"} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", color: "#8b8b8b", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Teléfono</label>
                  <input type="text" {...register("telephone", { required: true })} style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#3ecf8e"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#2e2e2e"} />
                </div>
                <div>
                  <label style={{ display: "block", color: "#8b8b8b", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Edad</label>
                  <input type="number" {...register("age", { required: true, valueAsNumber: true })} style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#3ecf8e"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#2e2e2e"} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "#8b8b8b", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>
                  Nueva contraseña <span style={{ color: "#555", fontStyle: "italic", fontWeight: "400" }}>(opcional)</span>
                </label>
                <input type="password" {...register("password")} placeholder="Dejar en blanco para no cambiar" style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#3ecf8e"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#2e2e2e"} />
              </div>

              <div style={{ borderTop: "1px solid #2e2e2e", paddingTop: "24px", marginTop: "8px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  style={{ backgroundColor: "#3ecf8e", color: "#050505", border: "none", borderRadius: "8px", padding: "12px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#2bbd7a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#3ecf8e"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
