import mongoose from 'mongoose';

const escenarioSchema = new mongoose.Schema(
    {
        tramite: { type: mongoose.Schema.Types.ObjectId, ref: 'Tramite', required: true },
        datos: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

export const Escenario = mongoose.model('Escenario', escenarioSchema);
