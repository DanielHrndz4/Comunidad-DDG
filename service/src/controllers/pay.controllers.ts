import { Request, Response } from "express";
import { PayService } from "../services/pay.services.js";
import { HttpResponse } from "../utils/http.response.js";
import { HttpCodes } from "../constants/http.code.js";

const payService = new PayService();

export class PayController {
    // Controlador para agregar un pago de vigilancia
    public async addPayVigilance(req: Request, res: Response): Promise<Response> {
        try {
            const { numberTarget, context, amount, date, cvc } = req.body;

            const payData = { numberTarget, context, amount, date, cvc };

            const userId = (req as unknown as Record<string, unknown>).user ? ((req as unknown as Record<string, unknown>).user as Record<string, unknown>).id : undefined;

            const savePay = await payService.processPay(payData, userId);

            return res.status(HttpCodes.CREATED).json(HttpResponse(HttpCodes.CREATED, "Pago procesado exitosamente", savePay, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, err.message, null, false));
        }
    }

    // Controlador para obtener todos los pagos registrados
    public async getAllPay(req: Request, res: Response): Promise<Response> {
        try {
            const pay = await payService.selectPay();
            return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Pagos obtenidos", pay, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error al obtener los pagos", null, false));
        }
    }
}

export const payController = new PayController();
