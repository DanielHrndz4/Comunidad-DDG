import Visit from "../models/visit.model.js";
import { 
    createNewSchedule, 
    getAllSchedulesService
 } from "../services/vigilant.services.js";


// Controlador para crear un nuevo horario
export const createSchedule = async (req, res) => {
    try {
        // Se extraen los datos enviados en el cuerpo de la petición
        const { name, lunes, martes, miercoles, jueves, viernes, sabado, domingo } = req.body;

        // Se arma un objeto con los datos del horario
        const scheduleData = { name, lunes, martes, miercoles, jueves, viernes, sabado, domingo };

        // Llama al servicio que guarda el horario en la base de datos
        const saveSchedule = await createNewSchedule(scheduleData);

        // Devuelve el horario guardado
        res.json(saveSchedule);
    } catch (error) {
        console.log("Error al almacenar un horario");
    }
};


// Controlador para crear una visita
export const createVisit = async (req, res) => {
    // Se extraen los datos enviados en la petición
    const { visitName, dui, numPlaca, visitHouse, date } = req.body;
    
    try {
        // Se crea una instancia del modelo Visit con los datos del formulario
        const newVisit = new Visit({
            visitName, dui, numPlaca, visitHouse, date
        });

        // Se guarda la visita en la base de datos
        const saveSchedule = await newVisit.save();

        // Se responde con la visita guardada
        res.json(saveSchedule);
    } catch (error) {
        console.log("Error al almacenar una visita");
    }
}


// Controlador para obtener todos los horarios registrados
export const getAllSchedules = async (req, res) => {
    try {
        // Llama al servicio que obtiene todos los horarios
        const schedules = await getAllSchedulesService();

        // Devuelve los horarios
        res.json(schedules);
    } catch (error) {
        console.log("Error al obtener resultados", error);
    }
};


// Controlador para obtener todas las visitas registradas
export const getAllVisits = async (req, res) => {
    // Obtiene todas las visitas almacenadas en la base de datos
    const visit = await Visit.find();

    // Devuelve el listado
    res.json(visit);
}
