import mongoose from 'mongoose';

const tramiteSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true, trim: true },
        descripcion: { type: String },
        dificultad: { type: String, enum: ['baja', 'media', 'alta'], default: 'baja' },
        activo: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Tramite = mongoose.model('Tramite', tramiteSchema);
