import { useState } from 'react';
import * as api from './api';
import Banner from './components/Banner';
import IntroPrototipo from './components/IntroPrototipo';
import IntroSimulador from './components/IntroSimulador';
import Progreso from './components/Progreso';
import PasoNavegacion from './components/PasoNavegacion';
import PasoFormulario from './components/PasoFormulario';
import PasoResultado from './components/PasoResultado';
import BarraAyuda from './components/BarraAyuda';

export default function App() {
    const [estado, setEstado] = useState('intro1');
    const [tramite, setTramite] = useState(null);
    const [sesionId, setSesionId] = useState(null);
    const [ordenActual, setOrdenActual] = useState(1);
    const [resultado, setResultado] = useState(null);
    const [errorCarga, setErrorCarga] = useState('');

    async function empezar() {
        setEstado('cargando');
        setErrorCarga('');
        try {
            const lista = await api.getTramites();
            if (lista.status !== 200 || !lista.data.length) {
                throw new Error('No hay trámites disponibles en este momento.');
            }
            const id = lista.data[0]._id;
            const detalle = await api.getTramite(id);
            const sesion = await api.crearSesion(id);
            if (sesion.status !== 201) throw new Error('No se pudo crear la práctica.');

            setTramite(detalle.data);
            setSesionId(sesion.data._id);
            setOrdenActual(1);
            setResultado(null);
            setEstado('practica');
        } catch (e) {
            setErrorCarga(e.message || 'Hubo un problema al conectar con el servidor.');
            setEstado('intro2');
        }
    }

    function reiniciar() {
        setEstado('intro1');
        setTramite(null);
        setSesionId(null);
        setOrdenActual(1);
        setResultado(null);
    }

    if (estado === 'intro1') return <IntroPrototipo onComenzar={() => setEstado('intro2')} />;
    if (estado === 'intro2') return <IntroSimulador onEmpezar={empezar} error={errorCarga} />;
    if (estado === 'cargando') {
        return (
            <div className="app">
                <Banner />
                <main className="contenido">
                    <p className="cargando">Cargando práctica…</p>
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

    return (
        <div className="app">
            <header className="barra-superior">
                <Banner />
                <Progreso actual={paso.orden} total={total} onVolver={volver} onSalir={reiniciar} />
            </header>
            <main className="contenido">
                {paso.tipo === 'navegacion' && (
                    <PasoNavegacion paso={paso} onAvanzar={(destino) => setOrdenActual(destino)} />
                )}
                {paso.tipo === 'formulario' && (
                    <PasoFormulario
                        paso={paso}
                        sesionId={sesionId}
                        onExito={(r) => {
                            setResultado(r.resultado);
                            setOrdenActual(r.siguientePaso);
                        }}
                    />
                )}
                {paso.tipo === 'resultado' && (
                    <PasoResultado resultado={resultado} pasos={pasos} onReiniciar={reiniciar} />
                )}
            </main>

            <BarraAyuda texto={paso.ayudaTexto} audio={paso.ayudaAudio} />
        </div>
    );
}
