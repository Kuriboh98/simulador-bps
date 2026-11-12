import { useState } from 'react';
import * as api from '../api';

export default function PasoAgenda({ paso, sesionId, onExito }) {
    const opciones = paso.opciones || {};
    const dias = opciones.dias || [];
    const horas = opciones.horas || [];
    const [dia, setDia] = useState('');
    const [hora, setHora] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');

    const listo = dia && hora;

    async function confirmar() {
        if (!listo) return;
        setEnviando(true);
        setError('');
        try {
            const { status, data } = await api.validar(sesionId, { dia, hora });
            if (status === 200 && data.ok) {
                onExito({
                    siguientePaso: data.siguientePaso,
                    resultado: {
                        titulo: '¡Listo! Quedó agendado',
                        campos: [
                            { etiqueta: 'Día', valor: dia },
                            { etiqueta: 'Hora', valor: hora },
                            { etiqueta: 'Dónde', valor: opciones.lugar },
                        ],
                    },
                });
            } else {
                setError('Hubo un problema. Pruebe de nuevo.');
            }
        } catch {
            setError('No se pudo conectar. Pruebe de nuevo.');
        } finally {
            setEnviando(false);
        }
    }

    return (
        <section className="paso">
            <div className="pantalla-marco">
                <div className="agenda">
                    <div className="agenda-cabecera">Agendarse para una consulta</div>
                    <div className="agenda-cuerpo">
                        <p className="agenda-label">1. Elija el día</p>
                        <div className="agenda-opciones">
                            {dias.map((d) => (
                                <button
                                    key={d}
                                    className={`opcion-chip ${dia === d ? 'sel' : ''}`}
                                    aria-pressed={dia === d}
                                    onClick={() => setDia(d)}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        <p className="agenda-label">2. Elija la hora</p>
                        <div className="agenda-opciones">
                            {horas.map((h) => (
                                <button
                                    key={h}
                                    className={`opcion-chip ${hora === h ? 'sel' : ''}`}
                                    aria-pressed={hora === h}
                                    onClick={() => setHora(h)}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>

                        <button
                            className="btn-primario agenda-confirmar"
                            disabled={!listo || enviando}
                            onClick={confirmar}
                        >
                            {enviando ? '…' : 'Confirmar la reserva'}
                        </button>

                        {error && (
                            <p className="campo-mensaje-error" role="alert">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
                <p className="captura-pie">Toque un día y una hora, y después "Confirmar la reserva".</p>
            </div>
        </section>
    );
}
