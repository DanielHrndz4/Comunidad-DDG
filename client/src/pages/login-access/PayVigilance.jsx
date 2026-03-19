import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import assets from "../../../src/assets";
import "./PayVigilance.css";

function PayVigilance() {
    const { addPay, user } = useAuth();
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
    const navigate = useNavigate();

    // Función que valida número de tarjeta mediante Algoritmo de Luhn
    const validarNumeroTarjeta = (numberTarget) => {
        const cleanNumber = numberTarget.replace(/\D/g, ''); // elimina caracteres no numéricos
        if (!/^\d{13,19}$/.test(cleanNumber)) return false;

        let suma = 0;
        let alternar = false;
        for (let i = cleanNumber.length - 1; i >= 0; i--) {
            let digito = parseInt(cleanNumber.charAt(i), 10);
            if (alternar) {
                digito *= 2;
                if (digito > 9) digito -= 9;
            }
            suma += digito;
            alternar = !alternar;
        }
        return suma % 10 === 0;
    };

    // Función que valida CVC (3 o 4 dígitos)
    const validarCVC = (cvc) => /^\d{3,4}$/.test(cvc);

    // Genera una factura PDF con los datos del pago
    const generarFacturaPDF = (datos) => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Factura de Pago", 20, 20);

        doc.setFontSize(12);
        doc.text(`Nombre del usuario: ${user?.name || "Usuario"}`, 20, 40);
        doc.text(`Número de tarjeta: **** **** **** ${datos.numberTarget.slice(-4)}`, 20, 50);
        doc.text(`Contexto: ${datos.context}`, 20, 60);
        doc.text(`Monto: $${datos.amount}`, 20, 70);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 80);

        doc.save(`Factura_${new Date().getTime()}.pdf`);
    };

    // Función ejecutada al enviar el formulario
    const onSubmit = handleSubmit(async (values) => {
        const { numberTarget, cvc } = values;

        // Validaciones
        if (!validarNumeroTarjeta(numberTarget)) {
            setError("numberTarget", { type: "manual", message: "Número de tarjeta inválido" });
            return;
        } else {
            clearErrors("numberTarget");
        }

        if (!validarCVC(cvc)) {
            setError("cvc", { type: "manual", message: "CVC inválido" });
            return;
        } else {
            clearErrors("cvc");
        }

        // Agrega el pago al contexto
        addPay(values);

        // Genera PDF de factura
        generarFacturaPDF(values);

        alert("Pago realizado con éxito");

        // Redirecciona al home de usuario
        navigate("/user");
    });

    return (
        <div>
            {/* Navbar simple para navegación */}
            <nav className="user-home-navbar">
                <div className="user-home-navbar-left">
                    <Link></Link>
                </div>
                <div className="user-home-navbar-right">
                    <Link to="/user">
                        <img src={assets.casa} alt="Inicio" className="user-home-icono" />
                    </Link>
                    <div className="user-home-dropdown">
                        <Link to="/profile">
                            <img src={assets.usuario1} alt="Usuario" className="user-home-icono-usuario" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Formulario de pago */}
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        type="text"
                        {...register("numberTarget", { required: "El número de tarjeta es requerido" })}
                        placeholder="Número de tarjeta"
                    />
                    {errors.numberTarget && <p className="error">{errors.numberTarget.message}</p>}
                </div>
                <div>
                    <input
                        type="text"
                        {...register("context", { required: "El contexto es requerido" })}
                        placeholder="Contexto de pago"
                    />
                    {errors.context && <p className="error">{errors.context.message}</p>}
                </div>
                <div>
                    <input
                        type="number"
                        {...register("amount", { required: "El monto es requerido" })}
                        placeholder="Monto"
                    />
                    {errors.amount && <p className="error">{errors.amount.message}</p>}
                </div>
                <div>
                    <input
                        type="text"
                        {...register("cvc", { required: "El CVC es requerido" })}
                        placeholder="CVC"
                    />
                    {errors.cvc && <p className="error">{errors.cvc.message}</p>}
                </div>
                <button type="submit">Agregar pago</button>
            </form>
        </div>
    );
}

export default PayVigilance;
