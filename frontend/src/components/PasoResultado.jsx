export default function PasoResultado({ resultado, pasos, onReiniciar }) {
    return (
        <section className="paso">
            <div className="resultado-check" aria-hidden="true">
                ✅
            </div>
            <h1 className="paso-titulo centrado">¡Muy bien! Lo logró</h1>

            <div className="ficha-resultado">
                <p className="ficha-linea">
                    <span className="ficha-label">Cobra a partir del</span>
                    <span className="ficha-valor">{resultado?.fecha}</span>
                </p>
                <p className="ficha-linea">
                    <span className="ficha-label">Dónde</span>
                    <span className="ficha-valor">{resultado?.lugar}</span>
                </p>
            </div>

            <div className="resumen">
                <h2 className="resumen-titulo">Lo que practicó</h2>
                <ol className="resumen-lista">
                    {pasos.map((p) => (
                        <li key={p.orden}>{p.titulo}</li>
                    ))}
                </ol>
            </div>

            <button className="btn-primario" onClick={onReiniciar}>
                Practicar de nuevo
            </button>
        </section>
    );
}
