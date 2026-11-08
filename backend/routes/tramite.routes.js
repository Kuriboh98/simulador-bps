// routes/tramite.routes.js — el mapa de URLs de trámites.
import express from 'express';
import * as tramiteController from '../controllers/tramite.controller.js';

const router = express.Router();

router.get('/', tramiteController.listar); //       GET /api/tramites       (listar)
router.get('/:id', tramiteController.obtener); //   GET /api/tramites/:id   (uno, con sus pasos)

export default router;
