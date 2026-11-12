import { useState } from 'react';
import * as api from './api';
import Banner from './components/Banner';
import IntroPrototipo from './components/IntroPrototipo';
import IntroSimulador from './components/IntroSimulador';
import MenuTramites from './components/MenuTramites';
import Progreso from './components/Progreso';
import PasoNavegacion from './components/PasoNavegacion';
import PasoFormulario from './components/PasoFormulario';
import PasoAgenda from './components/PasoAgenda';
import PasoResultado from './components/PasoResultado';
import BarraAyuda from './components/BarraAyuda';

export default function App() {
    const [estado, setEstado] = useState('intro1');
    const [tramites, setTramites] = useState([]);
    const [tramiteId, setTramiteId] = useState(null);
    const [tramite, setTramite] = useState(null);
    const [sesionId, setSesionId] = useState(null);
    const [ordenActual, setOrdenActual] = useState(1);
    const [resultado, setResultado] = useState(null);
    const [errorCarga, setErrorCarga] = useState('');

    async function abrirMenu() {
        setEstado('cargando');
        setErrorCarga('');
        try {
            const lista = await api.getTramites();
            if (lista.status !== 200 || !lista.data.length) {
                throw new Error('No hay trámites disponibles en este momento.');
            }
            setTramites(lista.data);
            setEstado('menu');
        } catch (e) {
            setErrorCarga(e.message || 'Hubo un problema al conectar con el servidor.');
            setEstado('intro2');
        }
    }

    async function elegirTramite(id) {
        setEstado('cargando');
        setErrorCarga('');
        try {
            const detalle = await api.getTramite(id);
            const sesion = await api.crearSesion(id);
            if (detalle.status !== 200 || sesion.status !== 201) {
                throw new Error('No se pudo abrir el trámite.');
            }
            setTramiteId(id);
            setTramite(detalle.data);
            setSesionId(sesion.data._id);
            setOrdenActual(1);
            setResultado(null);
            setEstado('practica');
        } catch (e) {
            setErrorCarga(e.message || 'No se pudo abrir el trámite.');
            setEstado('menu');
        }
    }

    function volverAlMenu() {
        setTramite(null);
        setSesionId(null);
        setOrdenActual(1);
        setResultado(null);
        setEstado('menu');
    }

    if (estado === 'intro1') return <IntroPrototipo onComenzar={() => setEstado('intro2')} />;
    if (estado === 'intro2') return <IntroSimulador onEmpezar={abrirMenu} error={errorCarga} />;
    if (estado === 'menu') {
        return (
            <MenuTramites
                tramites={tramites}
                error={errorCarga}
                onElegir={elegirTramite}
                onVolver={() => setEstado('intro2')}
            />
        );
    }
    if (estado === 'cargando') {
        return (
            <div className="app">
                <Banner />
                <main className="contenido">
                    <p className="cargando">Cargando…</p>
                </main>
            </div>
        );
    }

    const pasos = tramite.pasos || [];
    const total = pasos.length;
    const paso = pasos.find((p) => p.orden === ordenActual) || pasos[0];

    function volver() {
        if (ordenActual > 1) setOrdenActual(ordenActual - 1);
    }

    function avanzarConResultado(r) {
        setResultado(r.resultado);
        setOrdenActual(r.siguientePaso);
    }

    return (
        <div className="app">
            <header className="barra-superior">
                <Banner />
                <Progreso actual={paso.orden} total={total} onVolver={volver} onSalir={volverAlMenu} />
            </header>
            <main className="contenido">
                {paso.tipo === 'navegacion' && (
                    <PasoNavegacion paso={paso} onAvanzar={(destino) => setOrdenActual(destino)} />
                )}
                {paso.tipo === 'formulario' && (
                    <PasoFormulario paso={paso} sesionId={sesionId} onExito={avanzarConResultado} />
                )}
                {paso.tipo === 'agenda' && (
                    <PasoAgenda paso={paso} sesionId={sesionId} onExito={avanzarConResultado} />
                )}
                {paso.tipo === 'resultado' && (
                    <PasoResultado
                        resultado={resultado}
                        pasos={pasos}
                        onRepetir={() => elegirTramite(tramiteId)}
                        onMenu={volverAlMenu}
                    />
                )}
            </main>

            <BarraAyuda texto={paso.ayudaTexto} audio={paso.ayudaAudio} />
        </div>
    );
}
