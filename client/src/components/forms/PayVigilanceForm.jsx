import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

/**
 * Componente PayVigilanceForm
 * - Formulario para procesar pagos de vigilancia.
 * - Valida número de tarjeta (algoritmo Luhn) y CVC en el cliente.
 * - Llama a la acción `addPay` desde AuthContext para enviar el pago al backend.
 * - Genera una factura en PDF con jsPDF tras el pago exitoso.
 * - Recibe `close` (función) para cerrar el modal/formulario desde el componente padre.
 */
export default function PayVigilanceForm({ close }) {
    // react-hook-form para el manejo del formulario
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();

    // Contexto de autenticación que expone la función para añadir pago y datos del usuario
    const { addPay, user } = useAuth();

    // Hook de navegación para redirigir después del pago
    const navigate = useNavigate();

    // ----------------------------
    // Función: validar número de tarjeta (Algoritmo de Luhn)
    // - Elimina caracteres no numéricos
    // - Verifica longitud (13 a 19 dígitos) y aplica el cálculo de Luhn
    // - Retorna true si el número es válido, false en caso contrario
    // ----------------------------
    const validarNumeroTarjeta = (numberTarget) => {
        const cleanNumber = numberTarget.replace(/\D/g, ''); // Elimina caracteres no numéricos
        if (!/^\d{13,19}$/.test(cleanNumber)) {
            return false;
        }
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

    // ----------------------------
    // Función: validar CVC
    // - Acepta 3 o 4 dígitos (cartas más comunes)
    // ----------------------------
    const validarCVC = (cvc) => /^\d{3,4}$/.test(cvc);

    // ----------------------------
    // Función: generarFacturaPDF
    // - Usa jsPDF para crear y descargar un PDF con los datos básicos de la transacción
    // - Muestra el nombre del usuario (si está disponible), últimos 4 dígitos de la tarjeta,
    //   contexto, monto y fecha.
    // ----------------------------
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

    // ----------------------------
    // Función: onSubmit
    // - Ejecutada al enviar el formulario.
    // - Valida número de tarjeta y CVC con las funciones anteriores.
    // - Si la validación falla, marca errores en el formulario (setError) y detiene el envío.
    // - Si pasa la validación, llama a addPay(values) para procesar el pago en backend.
    // - Si el pago es exitoso: muestra SweetAlert, genera la factura (PDF), cierra el modal y redirige.
    // - Si falla el pago: muestra alerta de error.
    // ----------------------------
    const onSubmit = async (values) => {
        const { numberTarget, cvc } = values;
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
        try {
            // Procesar el pago y generar factura
            await addPay(values);

            // Mostrar alerta con animación
            await Swal.fire({
                icon: "success",
                title: "¡Pago realizado con éxito!",
                text: "Tu transacción se ha completado correctamente.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            await generarFacturaPDF(values);
            close(); // Cierra modal / formulario
            navigate("/admin"); // Redirige al panel de admin
        } catch (err) {
            console.error("Error al procesar el pago:", err);
            Swal.fire({
                icon: "error",
                title: "Error en el pago",
                text: "No se pudo completar la transacción. Intenta nuevamente.",
                confirmButtonColor: "#d33",
            });
        };
    }

    // ----------------------------
    // Render: formulario
    // - Campos: numberTarget, context, amount, cvc
    // - Muestra errores de validación en línea (react-hook-form)
    // - Botones: Cancelar (close) y Pagar (submit)
    // ----------------------------
    return (

        <div className="flex flex-col items-stretch bg-white p-32 rounded-xl shadow-lg w-500 h-full">
            <header className="bg-dark-green p-16 rounded-xl mb-8 text-center shadow-lg">
                <h2 style={{ color: "white" }} className="m-0 text-center text-[1.5rem] text-white">Pago de Vigilancia</h2>
            </header>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 shadow-lg rounded-xl w-full my-8 mx-0 p-16 bf-white">
                <div className="flex flex-col gap-4">
                    <label htmlFor="numberTarget" className="text-[1rem] font-[600] text-dark-slate">Número de tarjeta</label>
                    <input type="text" {...register("numberTarget", { required: "El número de tarjeta es requerido" })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Número de tarjeta"
                    />
                    {
                        errors.numberTarget && (<p className="text-red text-[0.8rem]">{errors.numberTarget.message}</p>)
                    }
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="context" className="text-[1rem] font-[600] text-dark-slate">Contexto de pago</label>
                    <input type="text" {...register("context", { required: "El contexto es requerido" })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Contexto de pago"
                    />
                    {
                        errors.context && (<p className="text-red text-[0.8rem]">{errors.context.message}</p>)
                    }
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="amount" className="text-[1rem] font-[600] text-dark-slate">Monto</label>
                    <input type="number" {...register("amount", { required: "El monto es requerido" })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Monto"
                    />
                    {
                        errors.amount && (<p className="text-red text-[0.8rem]">{errors.amount.message}</p>)
                    }
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="cvc" className="text-[1rem] font-[600] text-dark-slate">CVC</label>
                    <input type="text" {...register("cvc", { required: "El CVC es requerido" })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese una contraseña para el usuario"
                    />
                    {
                        errors.cvc && (<p className="text-red text-[0.8rem]">{errors.cvc.message}</p>)
                    }
                </div>

                <div className="flex justify-between gap-16 mt-16">
                    <button
                        type="button"
                        className="bg-custom-gray text-dark-gray py-12 px-16 border-none rounded-md
                        duration-300 ease-in-out cursor-pointer text-[1rem] hover:bg-mid-gray"
                        onClick={() => close()}>
                        Cancelar
                    </button>
                    <button type="submit" className="bg-dark-slate text-white py-12 px-16 border-none
                    duration-300 ease-in-out rounded-md cursor-pointer text-[1rem] hover:bg-custom-slate">
                        Pagar
                    </button>
                </div>
            </form>
        </div>
    );
}
