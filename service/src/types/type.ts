import { HttpCodes } from "../constants/http.code.js";

export type HttpResponseType = {
    code: HttpCodes,
    message: string,
    data: unknown | null,
    ok: boolean
}