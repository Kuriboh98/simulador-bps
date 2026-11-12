import mongoose from 'mongoose';

const posSchema = new mongoose.Schema(
    { x: Number, y: Number, w: Number, h: Number },
    { _id: false }
);

const campoSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true }, 
        etiqueta: { type: String, required: true }, 
        tipo: { type: String, enum: ['texto', 'numero', 'captcha'], default: 'texto' },
        ayuda: String,
        validacion: String,
        mensajeError: String,
        pos: posSchema, 
    },
    { _id: false }
);

const hotspotSchema = new mongoose.Schema(
    {
        x: Number,
        y: Number,
        w: Number,
        h: Number,
        etiqueta: String,
        destino: Number, 
    },
    { _id: false }
);

const pasoSchema = new mongoose.Schema(
    {
        tramite: { type: mongoose.Schema.Types.ObjectId, ref: 'Tramite', required: true },
        orden: { type: Number, required: true },
        titulo: { type: String, required: true },
        instruccion: String,
        tipo: { type: String, enum: ['navegacion', 'formulario', 'agenda', 'resultado'], required: true },
        ayudaTexto: String,
        ayudaAudio: String,
        imagenFondo: String,
        hotspots: [hotspotSchema],
        campos: [campoSchema],
        opciones: mongoose.Schema.Types.Mixed,
        boton: new mongoose.Schema(
            { x: Number, y: Number, w: Number, h: Number, etiqueta: String },
            { _id: false }
        ),
        // Vista alternativa "computadora": misma pantalla del BPS pero en versión web
        // (captura horizontal y sus propias coordenadas). Si no existe, se usa la de celular.
        web: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
);

export const Paso = mongoose.model('Paso', pasoSchema);
