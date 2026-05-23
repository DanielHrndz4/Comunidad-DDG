import { HttpCodes } from "@/constants/http.code.js";
import { HttpResponseType } from "@/types/type.js"

export const HttpResponse = (code: HttpCodes, message: String, data: Object | null = null, ok: Boolean = false) => {
    const response: HttpResponseType = { code, message, data, ok }
    return response;
}