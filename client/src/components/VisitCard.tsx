import { FiUser, FiCreditCard, FiHome, FiClock } from "react-icons/fi";

interface VisitItem {
  _id?: string;
  visitName: string;
  dui: string;
  numPlaca: string;
  visitHouse: number | string;
  date: string;
}

interface VisitCardProps {
  visit: VisitItem;
}

export default function VisitCard({ visit }: VisitCardProps) {
  const initial = visit.visitName ? visit.visitName.charAt(0).toUpperCase() : "?";
  
  let formattedDate = "";
  try {
    const d = new Date(visit.date);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      formattedDate = visit.date;
    }
  } catch {
    formattedDate = visit.date;
  }

  return (
    <div
      className="ddg-premium-card"
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 10px 25px rgba(20, 43, 54, 0.05)",
        border: "1.5px solid rgba(20, 43, 54, 0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        minHeight: "unset",   /* override the 420px from ddg-premium-card */
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 15px 35px rgba(20, 43, 54, 0.1)";
        e.currentTarget.style.borderColor = "rgba(45, 189, 161, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(20, 43, 54, 0.05)";
        e.currentTarget.style.borderColor = "rgba(20, 43, 54, 0.04)";
      }}
    >
      {/* Decorative colored top line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #2dbda1, #5c6bc0)",
        }}
      />

      {/* Header section with initials */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2dbda1 0%, #239c84 100%)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: "700",
            boxShadow: "0 4px 10px rgba(45, 189, 161, 0.2)",
          }}
        >
          {initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 700,
              color: "#142B36",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {visit.visitName}
          </h4>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#8c92ac",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Visitante
          </span>
        </div>
      </div>

      {/* Details section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          padding: "12px",
          borderRadius: "12px",
          background: "#f8f9fa",
          fontSize: "13px",
          color: "#4f5e71",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiCreditCard style={{ color: "#2dbda1", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "10px", color: "#8c92ac", fontWeight: 600 }}>DUI</div>
            <div style={{ fontWeight: 600 }}>{visit.dui}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiHome style={{ color: "#5c6bc0", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "10px", color: "#8c92ac", fontWeight: 600 }}>CASA</div>
            <div style={{ fontWeight: 600 }}>#{visit.visitHouse}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", gridColumn: "1 / -1" }}>
          <FiUser style={{ color: "#f59e0b", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "10px", color: "#8c92ac", fontWeight: 600 }}>MATRÍCULA / PLACA</div>
            <div style={{ fontWeight: 600, textTransform: "uppercase" }}>{visit.numPlaca || "N/A"}</div>
          </div>
        </div>
      </div>

      {/* Timestamp footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "11px",
          color: "#8c92ac",
          marginTop: "4px",
          borderTop: "1px solid #f1f2f4",
          paddingTop: "10px",
        }}
      >
        <FiClock size={12} />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}