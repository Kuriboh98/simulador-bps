import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import { Tramite } from '../models/tramite.model.js';
import { Paso } from '../models/paso.model.js';
import { Escenario } from '../models/escenario.model.js';
import { Sesion } from '../models/sesion.model.js';

let mongod;
let tramiteId;
let sesionId;

// Arranca una base MongoDB en memoria antes de todas las pruebas.
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
});

// Apaga y limpia todo al terminar.
afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

// Antes de cada test: base limpia + un trámite con escenario + una sesión nueva.
beforeEach(async () => {
    await Promise.all([
        Tramite.deleteMany({}),
        Paso.deleteMany({}),
        Escenario.deleteMany({}),
        Sesion.deleteMany({}),
    ]);

    const tramite = await Tramite.create({
        nombre: 'Consultar fecha y lugar de cobro',
        dificultad: 'baja',
    });
    tramiteId = tramite._id.toString();

    // Los 3 pasos
    await Paso.insertMany([
        { tramite: tramite._id, orden: 1, titulo: 'Entrar', tipo: 'navegacion' },
        { tramite: tramite._id, orden: 2, titulo: 'Datos', tipo: 'formulario' },
        { tramite: tramite._id, orden: 3, titulo: 'Resultado', tipo: 'resultado' },
    ]);

    await Escenario.create({
        tramite: tramite._id,
        datos: {
            captchaEsperado: 'JFNH4',
            resultado: { fecha: '2 de octubre de 2026', lugar: 'tu red de cobranza habitual' },
        },
    });

    const res = await request(app).post('/api/sesiones').send({ tramiteId });
    sesionId = res.body._id;
});

describe('POST /api/sesiones (crear práctica)', () => {
    it('crea la sesión en el paso 1, sin intentos ni errores', async () => {
        const res = await request(app).post('/api/sesiones').send({ tramiteId });
        expect(res.status).toBe(201);
        expect(res.body.pasoActual).toBe(1);
        expect(res.body.intentos).toBe(0);
        expect(res.body.errores).toBe(0);
        expect(res.body.completada).toBe(false);
    });

    it('devuelve 404 si el trámite no existe', async () => {
        const idInventado = new mongoose.Types.ObjectId().toString();
        const res = await request(app).post('/api/sesiones').send({ tramiteId: idInventado });
        expect(res.status).toBe(404);
    });
});

describe('POST /api/sesiones/:id/validar (CA1–CA4)', () => {
    it('CA1 (éxito): documento numérico + código correcto → avanza y muestra la fecha', async () => {
        const res = await request(app)
            .post(`/api/sesiones/${sesionId}/validar`)
            .send({ campos: { documento: '41234567', captcha: 'JFNH4' } });

        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.siguientePaso).toBe(3); // el paso de resultado
        expect(res.body.resultado.fecha).toBe('2 de octubre de 2026');

        // La sesión queda marcada como completada.
        const sesion = await Sesion.findById(sesionId);
        expect(sesion.completada).toBe(true);
        expect(sesion.pasoActual).toBe(3);
    });

    it('CA2 (documento mal): con puntos/guiones → 422, marca el campo documento y no avanza', async () => {
        const res = await request(app)
            .post(`/api/sesiones/${sesionId}/validar`)
            .send({ campos: { documento: '4.123-456', captcha: 'JFNH4' } });

        expect(res.status).toBe(422);
        expect(res.body.ok).toBe(false);
        expect(res.body.campo).toBe('documento');
        expect(res.body.mensaje).toMatch(/puntos ni guiones/i);

        // No avanzó: sigue sin completar.
        const sesion = await Sesion.findById(sesionId);
        expect(sesion.completada).toBe(false);
    });

    it('CA3 (código mal): captcha que no coincide → 422, marca el campo captcha', async () => {
        const res = await request(app)
            .post(`/api/sesiones/${sesionId}/validar`)
            .send({ campos: { documento: '41234567', captcha: 'XXXXX' } });

        expect(res.status).toBe(422);
        expect(res.body.ok).toBe(false);
        expect(res.body.campo).toBe('captcha');
        expect(res.body.mensaje).toMatch(/no coincide/i);
    });

    it('CA4 (registro): cada intento suma a intentos; un error suma también a errores', async () => {
        // Primer intento: error de captcha.
        await request(app)
            .post(`/api/sesiones/${sesionId}/validar`)
            .send({ campos: { documento: '41234567', captcha: 'XXXXX' } });
        // Segundo intento: éxito.
        await request(app)
            .post(`/api/sesiones/${sesionId}/validar`)
            .send({ campos: { documento: '41234567', captcha: 'JFNH4' } });

        const sesion = await Sesion.findById(sesionId);
        expect(sesion.intentos).toBe(2);
        expect(sesion.errores).toBe(1);
    });

    it('devuelve 404 si la sesión no existe', async () => {
        const idInventado = new mongoose.Types.ObjectId().toString();
        const res = await request(app)
            .post(`/api/sesiones/${idInventado}/validar`)
            .send({ campos: { documento: '41234567', captcha: 'JFNH4' } });
        expect(res.status).toBe(404);
    });
});
