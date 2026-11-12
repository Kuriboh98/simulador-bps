import { useState } from 'react';

export default function PasoNavegacion({ paso, onAvanzar }) {
    const [mostrarHint, setMostrarHint] = useState(false);

    return (
        <section className="paso">
            <div className="pantalla-marco">
                <div className="captura-wrap" onClick={() => setMostrarHint(true)}>
                    <img src={`/capturas/${paso.imagenFondo}`} alt="Pantalla del BPS" className="captura" />
                    {paso.hotspots.map((h, i) => (
                        <button
                            key={i}
                            className="hotspot"
                            title={h.etiqueta}
                            aria-label={`Tocar ${h.etiqueta}`}
                            style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAvanzar(h.destino);
                            }}
                        >
                            <span className="hotspot-etiqueta">Toque aquí 👆</span>
                        </button>
                    ))}
                </div>
            </div>

            {mostrarHint && (
                <div className="aviso-calmo" role="status">
                    No pasó nada. Toque el recuadro resaltado.
                </div>
            )}
        </section>
    );
}
