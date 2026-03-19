import { processPay, selectPay } from "../services/pay.services.js";

// Controlador para agregar un pago de vigilancia
export const addPayVigilance = async (req, res) => {
    try {
        // Extrae los datos necesarios del cuerpo de la solicitud
        const { numberTarget, context, amount, date, cvc } = req.body;

        // Crea un objeto con los datos del pago
        const payData = { numberTarget, context, amount, date, cvc };

        // Obtiene el ID del usuario autenticado
        const userId = req.user.id;

        // Llama al servicio para procesar y guardar el pago
        const savePay = await processPay(payData, userId);

        // Devuelve la respuesta en formato JSON
        res.json(savePay);
    } catch (error) {
        // Maneja y muestra posibles errores
        console.log("Error al guardar un pago", error);
    }
};

// Controlador para obtener todos los pagos registrados
export const getAllPay = async (req, res) => {
    try {
        // Llama al servicio que obtiene todos los pagos
        const pay = await selectPay();

        // Devuelve los pagos obtenidos
        res.json(pay);
    } catch (error) {
        // Maneja errores al obtener los pagos
        console.log(error);
    }
};
