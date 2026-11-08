import mongoose from 'mongoose';

const sesionSchema = new mongoose.Schema(
    {
        tramite: { type: mongoose.Schema.Types.ObjectId, ref: 'Tramite', required: true },
        escenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Escenario', required: true },
        apodo: { type: String, trim: true }, 
        pasoActual: { type: Number, default: 1 },
        intentos: { type: Number, default: 0 },
        errores: { type: Number, default: 0 },
        completada: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Sesion = mongoose.model('Sesion', sesionSchema);
