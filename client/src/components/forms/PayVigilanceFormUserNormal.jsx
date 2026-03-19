import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

export default function PayVigilanceForUserNormal({ close }) {
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
    const { addPay, user } = useAuth();
    const navigate = useNavigate();

    // Función para validar número de tarjeta usando el Algoritmo de Luhn
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

    const validarCVC = (cvc) => /^\d{3,4}$/.test(cvc);

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
            close();
            navigate("/user");
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