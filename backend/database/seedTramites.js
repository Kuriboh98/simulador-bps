import 'dotenv/config';
import mongoose from 'mongoose';
import { connectMongoDB } from './mongodb.js';
import { Tramite } from '../models/tramite.model.js';
import { Paso } from '../models/paso.model.js';
import { Escenario } from '../models/escenario.model.js';

//Datos del trámite

const TRAMITE = {
    nombre: 'Consultar fecha y lugar de cobro',
    descripcion:
        'Practique cómo averiguar en qué fecha y lugar va a cobrar su jubilación o pensión en la web del BPS.',
    dificultad: 'baja',
    activo: true,
};


const PASOS = [
    {
        orden: 1,
        titulo: 'Entrar a "Fecha y lugar de cobro"',
        instruccion: 'En la pantalla de inicio del BPS, toque "Fecha y lugar de cobro".',
        tipo: 'navegacion',
        ayudaTexto:
            'Está en la página de inicio del BPS. Más abajo hay una lista con un calendario que dice "Fecha y lugar de cobro". Toque esa opción.',
        ayudaAudio:
            'Está en la página de inicio del BPS. Busque la opción que dice Fecha y lugar de cobro, tiene un dibujo de calendario, y tóquela.',
        imagenFondo: 'paso1-inicio.jpg',
        hotspots: [
            {
                x: 3,
                y: 67,
                w: 92,
                h: 9,
                etiqueta: 'Fecha y lugar de cobro',
                destino: 2,
            },
        ],
        campos: [],
    },
    {
        orden: 2,
        titulo: 'Ingresar sus datos',
        instruccion: 'Escriba su número de documento y copie el código de seguridad que ve en la imagen.',
        tipo: 'formulario',
        ayudaTexto:
            'Escriba su número de documento sin puntos ni guiones. Después copie el código de seguridad (las letras de la imagen) tal cual, respetando mayúsculas. Al final toque Consultar.',
        ayudaAudio:
            'Escriba su número de documento, solo los números, sin puntos ni guiones. Luego copie el código de seguridad que aparece en la imagen, tal como lo ve. Después toque Consultar.',
        imagenFondo: 'paso2-formulario.jpg',
        hotspots: [],
        campos: [
            {
                nombre: 'documento',
                etiqueta: 'Número de documento',
                tipo: 'numero',
                ayuda: 'Solo números, sin puntos ni guiones.',
                validacion: 'solo numeros, sin puntos ni guiones',
                mensajeError: 'Revise el documento: tiene que ser solo números, sin puntos ni guiones.',
                pos: { x: 55, y: 41, w: 42, h: 5 }, // sobre el recuadro real del documento
            },
            {
                nombre: 'captcha',
                etiqueta: 'Código de seguridad',
                tipo: 'captcha',
                ayuda: 'Copie las letras de la imagen tal cual, respetando mayúsculas.',
                validacion: 'debe coincidir con el código de la imagen',
                mensajeError: 'El código no coincide. Cópielo de nuevo, tal cual aparece en la imagen.',
                pos: { x: 27, y: 61.5, w: 47, h: 4.5 }, // sobre el recuadro real del código
            },
        ],
        // Botón "Consultar" dibujado sobre el botón real de la captura.
        boton: { x: 33, y: 66.5, w: 34, h: 5, etiqueta: 'Consultar' },
    },
    {
        orden: 3,
        titulo: 'Ver su fecha de cobro',
        instruccion: 'Listo: acá aparece cuándo y dónde va a cobrar.',
        tipo: 'resultado',
        ayudaTexto:
            'Esta es la pantalla final. Le muestra la fecha a partir de la cual puede cobrar y el lugar donde hacerlo.',
        ayudaAudio: 'Muy bien. Esta pantalla le muestra la fecha y el lugar donde va a cobrar.',
        imagenFondo: '', // el resultado es una ficha propia, no una captura
        hotspots: [],
        campos: [],
    },
];

// Escenario ficticio
const ESCENARIO = {
    datos: {
        captchaEsperado: 'JFNH4',
        resultado: {
            fecha: '2 de octubre de 2026',
            lugar: 'su red de cobranza habitual (Abitab, Red Pagos o el banco donde cobra)',
        },
    },
};

//Ejecución

async function seed() {
    await connectMongoDB();

    await Promise.all([Tramite.deleteMany({}), Paso.deleteMany({}), Escenario.deleteMany({})]);

    const tramite = await Tramite.create(TRAMITE);

    await Paso.insertMany(PASOS.map((paso) => ({ ...paso, tramite: tramite._id })));

    await Escenario.create({ ...ESCENARIO, tramite: tramite._id });

    console.log('Seed completado:');
    console.log(`  Trámite: ${tramite.nombre} (${tramite._id})`);
    console.log(`  Pasos: ${PASOS.length}`);
    console.log('  Escenario: 1');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((error) => {
    console.error('Error en el seed:', error);
    process.exit(1);
});
