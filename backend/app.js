import express from 'express';
import cors from 'cors';
import tramiteRouter from './routes/tramite.routes.js';
import sesionRouter from './routes/sesion.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ ok: true, service: 'Simulador BPS API' });
});

// Rutas
app.use('/api/tramites', tramiteRouter);
app.use('/api/sesiones', sesionRouter);

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores
app.use((err, req, res, next) => {
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'id inválido' });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    const status = err.status || 500;
    if (status === 500) console.error(err);
    res.status(status).json({ error: err.message || 'Error interno del servidor' });
});

export default app;
