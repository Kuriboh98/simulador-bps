const BPS_TRAMITE_URL =
    'https://serviciosenlinea.bps.gub.uy/ServiciosEnLineaWeb/contenidosEmbebido?id=8771';

export default function IntroSimulador({ onEmpezar, error }) {
    return (
        <div className="app">
            <main className="intro intro-simulador">
                <h1 className="intro-simulador-titulo">Simulador BPS</h1>
                <p className="intro-simulador-sub">
                    Esto NO es la página oficial del BPS. Es para practicar sin miedo.
                </p>

                {error && <p className="aviso-error">{error}</p>}

                <button className="btn-primario" onClick={onEmpezar}>
                    Presione aqui para empezar →
                </button>

                <p className="intro-simulador-pie">
                    Para realizar el trámite oficial, que probó en el simulador de la página del BPS,
                    presione{' '}
                    <a href={BPS_TRAMITE_URL} target="_blank" rel="noopener noreferrer">
                        aqui
                    </a>
                    .
                </p>
            </main>
        </div>
    );
}
