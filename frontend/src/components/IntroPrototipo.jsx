export default function IntroPrototipo({ onComenzar }) {
    return (
        <div className="app">
            <main className="intro intro-prototipo">
                <h1 className="intro-prototipo-titulo">Prototipo</h1>
                <p className="intro-prototipo-sub">
                    Simulación de escenario de consultar la fecha y lugar de cobro de prestaciones
                </p>
                <div className="intro-prototipo-acceso">
                    <button className="btn-primario" onClick={onComenzar}>
                        Comenzar →
                    </button>
                </div>
            </main>
        </div>
    );
}
