import * as tramiteService from '../services/tramite.service.js';

export async function listar(req, res, next) {
    try {
        res.json(await tramiteService.listarTramites());
    } catch (err) {
        next(err);
    }
}

export async function obtener(req, res, next) {
    try {
        res.json(await tramiteService.obtenerTramite(req.params.id));
    } catch (err) {
        next(err);
    }
}
