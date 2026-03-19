import bcrypt from "bcrypt";
import Pay from '../models/pay.vigilance.model.js';
import { findPay, createPay, getAllPays } from "../repository/pay.repository.js";

/**
* Procesa un pago, validando si ya existe y encriptando el número de tarjeta.
* @async
* @function processPay
* @param {Object} payData - Datos del pago enviados por el usuario.
* @param {string} userId - ID del usuario que realiza el pago.
* @returns {Promise<Object>} Pago creado.
* @throws {Error} Cuando el número de tarjeta ya fue registrado.
*/
export const processPay = async (payData, userId) => {
    const { numberTarget, context, amount, date, cvc } = payData;

    const targetFound = await findPay(numberTarget);

    if(targetFound) {
        throw new Error("Error: Consulte con el administrador");
    }
    
    const targetHash = await bcrypt.hash(numberTarget, 10);

    const newPay = new Pay({
        numberTarget: targetHash,
        context, 
        amount, 
        date, 
        cvc,
        user: userId
    });

    return await createPay(newPay);
};

/**
* Obtiene todos los pagos almacenados.
* @async
* @function selectPay
* @returns {Promise<Array>} Lista de pagos.
*/
export const selectPay = async () => {
    return await getAllPays();
};