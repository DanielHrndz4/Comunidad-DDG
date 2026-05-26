import { HttpCodes } from "../constants/http.code.js";
import { HttpResponseType } from "../types/type.js";

export const HttpResponse = (code: HttpCodes, message: string, data: unknown | null = null, ok: boolean = false) => {
    const response: HttpResponseType = { code, message, data, ok }
    return response;
}