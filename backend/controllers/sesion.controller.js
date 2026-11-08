import * as sesionService from '../services/sesion.service.js';

export async function crear(req, res, next) {
    try {
        const sesion = await sesionService.crearSesion(req.body);
        res.status(201).json(sesion);
    } catch (err) {
        next(err);
    }
}

export async function obtener(req, res, next) {
    try {
        res.json(await sesionService.obtenerSesion(req.params.id));
    } catch (err) {
        next(err);
    }
}

export async function validar(req, res, next) {
    try {
        const resultado = await sesionService.validar(req.params.id, req.body.campos);
        res.status(resultado.ok ? 200 : 422).json(resultado);
    } catch (err) {
        next(err);
    }
}
