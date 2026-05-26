import bcrypt from "bcrypt";
import Pay from '../models/pay.vigilance.model.js';
import { findPay, createPay, getAllPays } from "../repository/pay.repository.js";

export class PayService {
    /**
    * Procesa un pago, validando si ya existe y encriptando el número de tarjeta.
    */
    public async processPay(payData: Record<string, unknown>, userId: unknown) {
        const { numberTarget, context, amount, date, cvc } = payData as Record<string, string>;

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

        return await createPay(newPay as unknown as Record<string, unknown>);
    }

    /**
    * Obtiene todos los pagos almacenados.
    */
    public async selectPay() {
        return await getAllPays();
    }
}