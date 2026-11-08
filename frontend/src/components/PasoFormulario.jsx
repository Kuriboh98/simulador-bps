import { useState } from 'react';
import * as api from '../api';

export default function PasoFormulario({ paso, sesionId, onExito }) {
    const [valores, setValores] = useState({});
    const [errorCampo, setErrorCampo] = useState(null);
    const [enviando, setEnviando] = useState(false);

    function cambiar(nombre, valor) {
        setValores((prev) => ({ ...prev, [nombre]: valor }));
        if (errorCampo?.campo === nombre) setErrorCampo(null);
    }

    async function consultar(e) {
        e.preventDefault();
        setEnviando(true);
        setErrorCampo(null);
        try {
            const { status, data } = await api.validar(sesionId, valores);
            if (status === 200 && data.ok) {
                onExito(data);
            } else if (status === 422 && !data.ok) {
                setErrorCampo({ campo: data.campo, mensaje: data.mensaje });
            } else {
                setErrorCampo({ campo: null, mensaje: 'Hubo un problema. Pruebe de nuevo.' });
            }
        } catch {
            setErrorCampo({ campo: null, mensaje: 'No se pudo conectar. Pruebe de nuevo.' });
        } finally {
            setEnviando(false);
        }
    }

    const boton = paso.boton;

    return (
        <section className="paso">
            <form onSubmit={consultar} noValidate>
                <div className="pantalla-marco">
                    <div className="captura-wrap captura-formulario">
                        <img
                            src={`/capturas/${paso.imagenFondo}`}
                            alt="Formulario del BPS"
                            className="captura"
                        />

                        {paso.campos.map((campo) =>
                            campo.pos ? (
                                <input
                                    key={campo.nombre}
                                    className={`captura-campo ${
                                        errorCampo?.campo === campo.nombre ? 'campo-con-error' : ''
                                    }`}
                                    aria-label={campo.etiqueta}
                                    inputMode={campo.tipo === 'numero' ? 'numeric' : 'text'}
                                    value={valores[campo.nombre] || ''}
                                    onChange={(e) => cambiar(campo.nombre, e.target.value)}
                                    autoComplete="off"
                                    style={{
                                        left: `${campo.pos.x}%`,
                                        top: `${campo.pos.y}%`,
                                        width: `${campo.pos.w}%`,
                                        height: `${campo.pos.h}%`,
                                    }}
                                />
                            ) : null
                        )}

                        {boton && (
                            <button
                                type="submit"
                                className="captura-boton"
                                disabled={enviando}
                                style={{
                                    left: `${boton.x}%`,
                                    top: `${boton.y}%`,
                                    width: `${boton.w}%`,
                                    height: `${boton.h}%`,
                                }}
                            >
                                {enviando ? '…' : boton.etiqueta}
                            </button>
                        )}
                    </div>
                    <p className="captura-pie">
                        Escriba los datos sobre la imagen y toque "{boton?.etiqueta || 'Consultar'}".
                    </p>
                </div>

                {errorCampo && (
                    <p className="campo-mensaje-error" role="alert">
                        {errorCampo.mensaje}
                    </p>
                )}
            </form>
        </section>
    );
}
