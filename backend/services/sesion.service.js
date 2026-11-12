// services/sesion.service.js — lógica de la práctica (crear sesión y validar datos).
import { Tramite } from '../models/tramite.model.js';
import { Paso } from '../models/paso.model.js';
import { Escenario } from '../models/escenario.model.js';
import { Sesion } from '../models/sesion.model.js';
import { httpError } from '../utils/httpError.js';

// Mensajes calmos y específicos (público 65+). Centralizados acá para reusarlos.
const MENSAJES = {
    documento: 'La cédula tiene que ir sin puntos ni guiones',
    captcha: 'El texto de la imagen no coincide',
};

// Crea una sesión de práctica para un trámite, asociándole su escenario.
export async function crearSesion({ tramiteId, apodo }) {
    const tramite = await Tramite.findById(tramiteId);
    if (!tramite) throw httpError(404, 'Trámite no encontrado');

    const escenario = await Escenario.findOne({ tramite: tramiteId });
    if (!escenario) throw httpError(404, 'El trámite no tiene un escenario de práctica');

    return Sesion.create({ tramite: tramiteId, escenario: escenario._id, apodo });
}

// Devuelve el estado actual de una sesión.
export async function obtenerSesion(id) {
    const sesion = await Sesion.findById(id);
    if (!sesion) throw httpError(404, 'Sesión no encontrada');
    return sesion;
}

// Valida los datos del formulario (RF1–RF5 / CA1–CA4).
// Devuelve { ok:true, siguientePaso, resultado }  ó  { ok:false, campo, mensaje }.
// Los errores de validación son resultados esperados (la persona se equivocó),
// no excepciones: se devuelven como ok:false y el controller responde 422.
export async function validar(id, campos = {}) {
    const sesion = await Sesion.findById(id);
    if (!sesion) throw httpError(404, 'Sesión no encontrada');

    const escenario = await Escenario.findById(sesion.escenario);
    if (!escenario) throw httpError(404, 'Escenario no encontrado');

    // CA4: todo intento se registra, con o sin error.
    sesion.intentos += 1;

    // Los trámites con formulario de CI + código (consultar cobro, constancia) validan
    // documento y captcha. Los que no tienen captcha en el escenario (agendarse) se saltan
    // esta parte: alcanza con que la persona haya elegido una opción.
    // Cada vista (celular / computadora) usa su propia captura, y cada captura trae su
    // propio código de seguridad "congelado". Aceptamos cualquiera de los códigos válidos
    // del escenario, así la persona practica con la vista que tenga elegida.
    const codigosValidos = [escenario.datos.captchaEsperado, escenario.datos.captchaEsperadoWeb].filter(
        Boolean
    );

    if (codigosValidos.length) {
        const documento = String(campos.documento ?? '').trim();
        const captcha = String(campos.captcha ?? '').trim();

        // CA2: el documento se acepta solo con números (sin puntos, guiones ni letras).
        if (!/^\d+$/.test(documento)) {
            sesion.errores += 1;
            await sesion.save();
            return { ok: false, campo: 'documento', mensaje: MENSAJES.documento };
        }

        // CA3: el código de verificación debe coincidir con el de la imagen que se mostró.
        if (!codigosValidos.includes(captcha)) {
            sesion.errores += 1;
            await sesion.save();
            return { ok: false, campo: 'captcha', mensaje: MENSAJES.captcha };
        }
    }

    // CA1 (éxito): avanza al paso de resultado y muestra la fecha/lugar de cobro.
    // Buscamos el orden del paso de tipo "resultado" (así no dependemos de un número fijo).
    const pasoResultado = await Paso.findOne({ tramite: sesion.tramite, tipo: 'resultado' }).sort('orden');
    const siguiente = pasoResultado ? pasoResultado.orden : sesion.pasoActual + 1;

    sesion.pasoActual = siguiente;
    sesion.completada = true;
    await sesion.save();

    return { ok: true, siguientePaso: siguiente, resultado: escenario.datos.resultado };
}
