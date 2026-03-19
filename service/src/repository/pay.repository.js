import Pay from "../models/pay.vigilance.model.js";

/**
* Busca un pago por el número de tarjeta.
* @async
* @function findPay
* @param {string|number} numberTarjet - Número de tarjeta asociado al pago.
* @returns {Promise<Object|null>} Documento encontrado o null si no existe.
*/
export const findPay = async (numberTarjet) => {
    return await Pay.findOne({ numberTarjet });
};

/**
* Crea un nuevo documento de pago en la base de datos.
* @async
* @function createPay
* @param {Object} payData - Datos del pago a registrar.
* @returns {Promise<Object>} El documento creado.
*/
export const createPay = async (payData) => {
    const newPay = new Pay(payData);
    return await newPay.save();
};

/**
* Obtiene todos los registros de pagos.
* @async
* @function getAllPays
* @returns {Promise<Array>} Lista de todos los pagos almacenados.
*/
export const getAllPays = async () => {
    return await Pay.find();
};