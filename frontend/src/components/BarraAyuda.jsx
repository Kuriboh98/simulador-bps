import { useState } from 'react';

export function hablar(texto) {
    try {
        if (!('speechSynthesis' in window) || !texto) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(texto);
        u.lang = 'es-ES';
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    } catch {
        //
    }
}

export default function BarraAyuda({ texto, audio }) {
    const [abierta, setAbierta] = useState(false);

    return (
        <>
            {abierta && (
                <div className="ayuda-panel" role="dialog" aria-label="Ayuda">
                    <p className="ayuda-panel-texto">{texto}</p>
                    <button className="ayuda-cerrar" onClick={() => setAbierta(false)}>
                        Entendido
                    </button>
                </div>
            )}

            <div className="barra-ayuda">
                <button className="btn-barra" onClick={() => setAbierta((a) => !a)}>
                    ❓ {abierta ? 'Ocultar ayuda' : 'Necesito ayuda'}
                </button>
                <button
                    className="btn-barra"
                    onClick={() => hablar(audio || texto)}
                    aria-label="Escuchar la ayuda en voz alta"
                >
                    🔊 Escuchar
                </button>
            </div>
        </>
    );
}
