import 'dotenv/config';
import mongoose from 'mongoose';
import { connectMongoDB } from './mongodb.js';
import { Tramite } from '../models/tramite.model.js';
import { Paso } from '../models/paso.model.js';
import { Escenario } from '../models/escenario.model.js';

// Cada entrada arma un trámite completo: sus datos, sus pasos y su escenario ficticio.
// El frontend decide cómo dibujar cada paso según su "tipo".

const TRAMITES = [
    {
        tramite: {
            nombre: 'Consultar fecha y lugar de cobro',
            descripcion:
                'Averigüe en qué fecha y lugar va a cobrar su jubilación o pensión.',
            dificultad: 'baja',
        },
        pasos: [
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
                hotspots: [{ x: 3, y: 67, w: 92, h: 9, etiqueta: 'Fecha y lugar de cobro', destino: 2 }],
            },
            {
                orden: 2,
                titulo: 'Ingresar sus datos',
                instruccion: 'Escriba su número de documento y copie el código de seguridad de la imagen.',
                tipo: 'formulario',
                ayudaTexto:
                    'Escriba su número de documento sin puntos ni guiones. Después copie el código de seguridad (las letras de la imagen) tal cual, respetando mayúsculas. Al final toque Consultar.',
                ayudaAudio:
                    'Escriba su número de documento, solo los números, sin puntos ni guiones. Luego copie el código de seguridad que aparece en la imagen, tal como lo ve. Después toque Consultar.',
                imagenFondo: 'paso2-formulario.jpg',
                campos: [
                    {
                        nombre: 'documento',
                        etiqueta: 'Número de documento',
                        tipo: 'numero',
                        ayuda: 'Solo números, sin puntos ni guiones.',
                        mensajeError: 'Revise el documento: tiene que ser solo números, sin puntos ni guiones.',
                        pos: { x: 55, y: 41, w: 42, h: 5 },
                    },
                    {
                        nombre: 'captcha',
                        etiqueta: 'Código de seguridad',
                        tipo: 'captcha',
                        ayuda: 'Copie las letras de la imagen tal cual, respetando mayúsculas.',
                        mensajeError: 'El código no coincide. Cópielo de nuevo, tal cual aparece en la imagen.',
                        pos: { x: 27, y: 61.5, w: 47, h: 4.5 },
                    },
                ],
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
            },
        ],
        escenario: {
            captchaEsperado: 'JFNH4',
            resultado: {
                icono: '✅',
                titulo: '¡Muy bien! Lo logró',
                campos: [
                    { etiqueta: 'Cobra a partir del', valor: '2 de octubre de 2026' },
                    {
                        etiqueta: 'Dónde',
                        valor: 'su red de cobranza habitual (Abitab, Red Pagos o el banco donde cobra)',
                    },
                ],
            },
        },
    },

    {
        tramite: {
            nombre: 'Agendarse para una consulta',
            descripcion: 'Reserve día y hora para ir a una oficina del BPS a hacer una consulta.',
            dificultad: 'media',
        },
        pasos: [
            {
                orden: 1,
                titulo: 'Entrar a "Trámites y agendas"',
                instruccion: 'En la pantalla de inicio del BPS, toque "Trámites y agendas".',
                tipo: 'navegacion',
                ayudaTexto:
                    'Está en la página de inicio del BPS. Busque la opción que dice "Trámites y agendas" y tóquela.',
                ayudaAudio:
                    'En la página de inicio del BPS, busque la opción que dice Trámites y agendas, y tóquela.',
                imagenFondo: 'paso1-inicio.jpg',
                hotspots: [{ x: 3, y: 59, w: 92, h: 9, etiqueta: 'Trámites y agendas', destino: 2 }],
            },
            {
                orden: 2,
                titulo: 'Elegir día y hora',
                instruccion: 'Toque el día y la hora que le queden cómodos.',
                tipo: 'agenda',
                ayudaTexto:
                    'Primero toque uno de los días. Después toque una de las horas disponibles. Cuando los dos queden marcados, toque "Confirmar la reserva".',
                ayudaAudio:
                    'Toque primero un día y después una hora. Cuando los dos estén marcados, toque Confirmar la reserva.',
                opciones: {
                    dias: ['Lunes 17/11', 'Martes 18/11', 'Miércoles 19/11', 'Jueves 20/11'],
                    horas: ['9:00', '10:30', '13:00', '15:30'],
                    lugar: 'Sucursal BPS – 18 de Julio 1990, Montevideo',
                },
            },
            {
                orden: 3,
                titulo: 'Confirmación de la reserva',
                instruccion: 'Listo: acá queda confirmado su día, hora y lugar.',
                tipo: 'resultado',
                ayudaTexto:
                    'Esta es la pantalla final. Le confirma el día, la hora y la oficina donde lo esperan.',
                ayudaAudio: 'Listo. Esta pantalla le confirma el día, la hora y la oficina de su consulta.',
            },
        ],
        escenario: {
            resultado: {
                icono: '📅',
                titulo: '¡Listo! Quedó agendado',
                campos: [],
            },
        },
    },

    {
        tramite: {
            nombre: 'Consultar recibo de cobro',
            descripcion: 'Vea el recibo de lo que cobró, para guardarlo o presentarlo donde se lo pidan.',
            dificultad: 'baja',
        },
        pasos: [
            {
                orden: 1,
                titulo: 'Entrar a "Consultar recibos de cobro"',
                instruccion: 'En la pantalla de inicio del BPS, toque "Consultar recibos de cobro".',
                tipo: 'navegacion',
                ayudaTexto:
                    'Está en la página de inicio del BPS. Busque la opción que dice "Consultar recibos de cobro" y tóquela.',
                ayudaAudio:
                    'En la página de inicio del BPS, busque la opción que dice Consultar recibos de cobro, y tóquela.',
                imagenFondo: 'paso1-inicio.jpg',
                hotspots: [{ x: 3, y: 75, w: 92, h: 9, etiqueta: 'Consultar recibos de cobro', destino: 2 }],
            },
            {
                orden: 2,
                titulo: 'Ingresar sus datos',
                instruccion: 'Escriba su número de documento y copie el código de seguridad de la imagen.',
                tipo: 'formulario',
                ayudaTexto:
                    'Escriba su número de documento sin puntos ni guiones. Después copie el código de seguridad de la imagen tal cual, respetando mayúsculas. Al final toque Consultar.',
                ayudaAudio:
                    'Escriba su número de documento, solo los números, sin puntos ni guiones. Luego copie el código de seguridad de la imagen, tal como lo ve. Después toque Consultar.',
                imagenFondo: 'paso2-formulario.jpg',
                campos: [
                    {
                        nombre: 'documento',
                        etiqueta: 'Número de documento',
                        tipo: 'numero',
                        ayuda: 'Solo números, sin puntos ni guiones.',
                        mensajeError: 'Revise el documento: tiene que ser solo números, sin puntos ni guiones.',
                        pos: { x: 55, y: 41, w: 42, h: 5 },
                    },
                    {
                        nombre: 'captcha',
                        etiqueta: 'Código de seguridad',
                        tipo: 'captcha',
                        ayuda: 'Copie las letras de la imagen tal cual, respetando mayúsculas.',
                        mensajeError: 'El código no coincide. Cópielo de nuevo, tal cual aparece en la imagen.',
                        pos: { x: 27, y: 61.5, w: 47, h: 4.5 },
                    },
                ],
                boton: { x: 33, y: 66.5, w: 34, h: 5, etiqueta: 'Consultar' },
            },
            {
                orden: 3,
                titulo: 'Ver su recibo',
                instruccion: 'Listo: acá aparece su recibo de cobro.',
                tipo: 'resultado',
                ayudaTexto:
                    'Esta es la pantalla final. Es su recibo de cobro, que puede guardar o presentar donde se lo pidan.',
                ayudaAudio: 'Listo. Este es su recibo de cobro, que puede guardar o presentar donde se lo pidan.',
            },
        ],
        escenario: {
            captchaEsperado: 'JFNH4',
            resultado: {
                icono: '🧾',
                titulo: 'Recibo de cobro',
                campos: [
                    { etiqueta: 'Prestación', valor: 'Jubilación común' },
                    { etiqueta: 'Mes', valor: 'Octubre de 2026' },
                    { etiqueta: 'Importe cobrado', valor: '$ 28.450' },
                    { etiqueta: 'Cobrado en', valor: 'Abitab' },
                ],
                nota: 'Puede guardar o imprimir su recibo para presentarlo donde se lo pidan.',
            },
        },
    },
];

async function seed() {
    await connectMongoDB();

    await Promise.all([Tramite.deleteMany({}), Paso.deleteMany({}), Escenario.deleteMany({})]);

    for (const def of TRAMITES) {
        const tramite = await Tramite.create(def.tramite);
        await Paso.insertMany(def.pasos.map((paso) => ({ ...paso, tramite: tramite._id })));
        await Escenario.create({ tramite: tramite._id, datos: def.escenario });
        console.log(`  Trámite: ${tramite.nombre} (${def.pasos.length} pasos)`);
    }

    console.log('Seed completado:');
    console.log(`  Trámites: ${TRAMITES.length}`);

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((error) => {
    console.error('Error en el seed:', error);
    process.exit(1);
});
