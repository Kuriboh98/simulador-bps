// services/tramite.service.js — lógica de negocio de trámites.
import { Tramite } from '../models/tramite.model.js';
import { Paso } from '../models/paso.model.js';
import { httpError } from '../utils/httpError.js';

// Lista los trámites disponibles (activos).
export async function listarTramites() {
    return Tramite.find({ activo: true }).select('nombre descripcion dificultad');
}

// Devuelve un trámite con sus pasos (ordenados). Útil para cargar todo de una.
export async function obtenerTramite(id) {
    const tramite = await Tramite.findById(id);
    if (!tramite) throw httpError(404, 'Trámite no encontrado');
    const pasos = await Paso.find({ tramite: id }).sort('orden');
    return { ...tramite.toObject(), pasos };
}
