import { useEffect, useState } from "react";
import { MdAddCircle, MdFileDownload, MdArrowBack, MdCreditCard } from "react-icons/md";
import { RiFileList3Line } from "react-icons/ri";
import Popup from "reactjs-popup";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";
import type { IPaymentRecord } from "../../interfaces/IPayment";
import PayVigilanceForm from "../../components/forms/PayVigilanceForm";
import "./LoginAccess.css";

export default function PaymentsView() {
  const { getPayments, user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<IPaymentRecord[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fetchPayments = async () => {
    setLoadingList(true);
    try {
      const data = await getPayments();
      // Sort by date descending
      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();
        return dateB - dateA;
      });
      setPayments(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => {
    setIsOpen(false);
    fetchPayments();
  };

  // Helper to format date nicely
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-SV", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Generate beautiful, high-quality receipt PDF
  const downloadReceipt = (pay: IPaymentRecord) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5",
      });

      // Colors
      const primaryColor = [45, 189, 161]; // #2dbda1
      const darkColor = [20, 43, 54]; // #142B36
      const grayColor = [100, 100, 100];

      // Draw premium receipt header
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 148, 25, "F");

      // Header Text
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("COMPROBANTE DE PAGO", 12, 16);

      doc.setFontSize(9);
      doc.setFont("Helvetica", "normal");
      doc.text("COMUNIDAD DDG", 110, 16);

      // Receipt details block
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFontSize(14);
      doc.setFont("Helvetica", "bold");
      doc.text("Detalle de Transacción", 12, 38);

      // Horizontal line separator
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(12, 42, 136, 42);

      // Information fields
      doc.setFontSize(10);
      let y = 50;

      const fields = [
        { label: "ID Transacción:", val: `TXN-${pay._id ? pay._id.toUpperCase().slice(-8) : Date.now().toString().slice(-8)}` },
        { label: "Vecino:", val: pay.user?.name || user?.name || "Usuario" },
        { label: "Email:", val: pay.user?.email || user?.email || "—" },
        { label: "Fecha y Hora:", val: formatDate(pay.createdAt || pay.date) },
        { label: "Concepto:", val: pay.context },
        { label: "Método de Pago:", val: "Tarjeta de Crédito/Débito" },
        { label: "Monto Pagado:", val: `$${pay.amount}.00 USD`, isBoldVal: true },
      ];

      fields.forEach((f) => {
        doc.setFont("Helvetica", "bold");
        doc.text(f.label, 12, y);
        
        if (f.isBoldVal) {
          doc.setFont("Helvetica", "bold");
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.setFontSize(12);
        } else {
          doc.setFont("Helvetica", "normal");
          doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
          doc.setFontSize(10);
        }
        
        doc.text(f.val, 50, y);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]); // reset
        doc.setFontSize(10); // reset
        y += 10;
      });

      // Separation Line before footer
      doc.line(12, y + 2, 136, y + 2);

      // Footer
      doc.setFont("Helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text("Este documento sirve como comprobante de pago oficial de la cuota de vigilancia comunitaria.", 12, y + 10);
      doc.text("¡Gracias por contribuir a mantener nuestra comunidad segura!", 12, y + 14);

      // Save PDF
      doc.save(`Recibo_Pago_${pay._id ? pay._id.slice(-6) : "DDG"}.pdf`);

      Swal.fire({
        title: "¡Recibo generado!",
        text: "Tu comprobante PDF se ha descargado correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "No se pudo generar el comprobante PDF.",
        icon: "error",
        confirmButtonColor: "#2dbda1",
      });
    }
  };

  return (
    <div className="ddg-dash-wrapper">
      {/* Background Decorations */}
      <div className="ddg-dash-bg-yellow" />
      <div className="ddg-dash-bg-red" />

      <div className="ddg-dash-content">
        {/* Page Header */}
        <div className="ddg-dash-header" style={{ width: "100%", maxWidth: "1100px", display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: "24px" }}>
          <button
            onClick={() => navigate(user?.role === "admin" ? "/admin" : "/user")}
            style={{
              background: "transparent",
              border: "none",
              color: "#5a7188",
              fontSize: "14px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              marginBottom: "16px",
              padding: 0,
            }}
          >
            <MdArrowBack size={18} />
            Volver al inicio
          </button>
          
          <p className="ddg-dash-greeting" style={{ margin: 0 }}>Comunidad DDG</p>
          <h1 className="ddg-dash-title" style={{ margin: "6px 0", textAlign: "left" }}>Gestión de Pagos</h1>
          <p className="ddg-dash-subtitle" style={{ textAlign: "left" }}>
            {user?.role === "admin"
              ? "Registro global de aportaciones de vigilancia de los vecinos"
              : "Consulta tu historial de aportaciones de vigilancia y genera nuevos pagos"}
          </p>
        </div>

        {/* Action bar */}
        <div style={{ width: "100%", maxWidth: "1100px", display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
          {user?.role !== "admin" && (
            <button
              type="button"
              onClick={openPopup}
              style={{
                background: "#fcc33a",
                color: "#142B36",
                border: "none",
                padding: "12px 28px",
                borderRadius: "30px",
                fontSize: "15px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(252,195,58,0.35)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(252,195,58,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(252,195,58,0.35)";
              }}
            >
              <MdAddCircle size={20} />
              Realizar Pago de Vigilancia
            </button>
          )}
        </div>

        {/* Payments list / history */}
        <div style={{ width: "100%", maxWidth: "1100px", background: "#ffffff", borderRadius: "24px", padding: "28px", boxShadow: "0 8px 30px rgba(20,43,54,0.06)", border: "1px solid rgba(20,43,54,0.05)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#142B36", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <RiFileList3Line size={20} style={{ color: "#2dbda1" }} />
            {user?.role === "admin" ? "Historial de Pagos Recibidos" : "Historial de mis Aportaciones"}
          </h2>

          {loadingList ? (
            <p style={{ textAlign: "center", color: "#8c92ac", padding: "40px 0" }}>Cargando pagos...</p>
          ) : payments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", color: "#8c92ac" }}>
              <p style={{ fontSize: "16px", fontWeight: 500, margin: "0 0 8px 0" }}>No se encontraron pagos registrados.</p>
              {user?.role !== "admin" && <p style={{ fontSize: "14px", margin: 0 }}>Haz clic en el botón de arriba para registrar tu primera cuota de vigilancia.</p>}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f0f2f5" }}>
                    {user?.role === "admin" && <th style={{ padding: "12px 16px", color: "#8c92ac", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Vecino</th>}
                    <th style={{ padding: "12px 16px", color: "#8c92ac", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Concepto</th>
                    <th style={{ padding: "12px 16px", color: "#8c92ac", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Monto</th>
                    <th style={{ padding: "12px 16px", color: "#8c92ac", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Fecha</th>
                    <th style={{ padding: "12px 16px", color: "#8c92ac", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((pay) => (
                    <tr key={pay._id} style={{ borderBottom: "1px solid #f0f2f5" }} className="table-row-hover">
                      {user?.role === "admin" && (
                        <td style={{ padding: "16px" }}>
                          <p style={{ margin: 0, fontWeight: 600, color: "#142B36" }}>{pay.user?.name || "Usuario"}</p>
                          <p style={{ margin: 0, fontSize: "12px", color: "#8c92ac" }}>{pay.user?.email || "—"}</p>
                        </td>
                      )}
                      <td style={{ padding: "16px", color: "#142B36", fontWeight: 500 }}>
                        {pay.context}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ background: "#e6f8f5", color: "#2dbda1", fontWeight: 700, padding: "4px 10px", borderRadius: "12px", fontSize: "14px" }}>
                          ${pay.amount}.00
                        </span>
                      </td>
                      <td style={{ padding: "16px", color: "#5a7188" }}>
                        {formatDate(pay.createdAt || pay.date)}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <button
                          type="button"
                          onClick={() => downloadReceipt(pay)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#2dbda1",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "14px",
                            fontWeight: 600,
                            padding: "6px 12px",
                            borderRadius: "8px",
                            transition: "background 0.2s",
                          }}
                          className="download-btn-hover"
                          title="Descargar comprobante de pago PDF"
                        >
                          <MdFileDownload size={18} />
                          Comprobante
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pay vigilance Modal */}
      <Popup
        open={isOpen}
        onClose={closePopup}
        lockScroll={true}
        position="top center"
        closeOnDocumentClick={false}
        modal={true}
        overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
        contentStyle={{
          maxHeight: "95vh",
          overflow: "auto",
          maxWidth: "600px",
          width: "95vw",
          borderRadius: "24px",
          padding: "0",
          border: "none",
          background: "transparent",
        }}
      >
        <PayVigilanceForm close={closePopup} />
      </Popup>

      <style>{`
        .table-row-hover:hover {
          background-color: #fcfdfe;
        }
        .download-btn-hover:hover {
          background-color: #e6f8f5;
        }
        @media (max-width: 680px) {
          .ddg-dash-content {
            padding: 20px 14px 28px !important;
          }
          /* Action bar button full-width */
          div[style*="justify-content: flex-end"] {
            justify-content: center !important;
            margin-bottom: 16px !important;
          }
          div[style*="justify-content: flex-end"] button {
            width: 100% !important;
            justify-content: center !important;
            padding: 10px 20px !important;
            font-size: 14px !important;
          }
          /* History card padding */
          div[style*="background: #ffffff"] {
            padding: 16px !important;
            border-radius: 16px !important;
          }
          /* Table typography and padding */
          th, td {
            padding: 12px 8px !important;
            font-size: 12px !important;
          }
          td p {
            font-size: 12px !important;
          }
          td p:nth-child(2) {
            display: none !important;
          }
          td span {
            font-size: 11px !important;
            padding: 2px 6px !important;
          }
        }
      `}</style>
    </div>
  );
}
