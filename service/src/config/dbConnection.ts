import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from "mongoose";
import "dotenv/config";
/*import { connectDB } from './db.ts';
import app from './app.ts';*/
/*connectDB();*/
console.log("URI:", process.env.MONGO_URL); 

/**
* Establece la conexión a la base de datos MongoDB usando la URI
* definida en la variable de entorno MONGO_URL.
* Lanza un Error si la URI no está definida o si ocurre un fallo
* al conectar.
*
*
* 
* 
*/
export const connectiondb = async () => {
    const URI = process.env.MONGO_URL;

    if (!URI) {
        throw new Error('No se ha definido la URI de la base de datos');
    }

    try {
        await mongoose.connect(URI);
        console.log("Conectado a MongoDB");
    } catch (e) {
        /*console.log("Error detallado de MongoDB:", e.message);*/
        console.error(e);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}