import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    name: String,
    lunes: String,
    martes: String,
    miercoles: String,
    jueves: String,
    viernes: String,
    sabado: String,
    domingo: String,
  });

export default mongoose.model("Schedule", scheduleSchema);