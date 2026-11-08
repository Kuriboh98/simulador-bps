// routes/sesion.routes.js — el mapa de URLs de sesiones de práctica.
import express from 'express';
import * as sesionController from '../controllers/sesion.controller.js';

const router = express.Router();

router.post('/', sesionController.crear); //            POST /api/sesiones         (crear práctica)
router.get('/:id', sesionController.obtener); //        GET  /api/sesiones/:id      (estado)
router.post('/:id/validar', sesionController.validar); // POST /api/sesiones/:id/validar  (CA1–CA4)

export default router;
