import { HttpCodes } from "../constants/http.code.js";

export type HttpResponseType = {
    code: HttpCodes,
    message: String,
    data: Object | null,
    ok: Boolean
}