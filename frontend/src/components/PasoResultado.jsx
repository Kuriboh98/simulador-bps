export default function PasoResultado({ resultado, pasos, onRepetir, onMenu }) {
    const campos = resultado?.campos || [];

    return (
        <section className="paso">
            <div className="resultado-check" aria-hidden="true">
                {resultado?.icono || '✅'}
            </div>
            <h1 className="paso-titulo centrado">{resultado?.titulo || '¡Muy bien! Lo logró'}</h1>

            {campos.length > 0 && (
                <div className="ficha-resultado">
                    {campos.map((c, i) => (
                        <p className="ficha-linea" key={i}>
                            <span className="ficha-label">{c.etiqueta}</span>
                            <span className="ficha-valor">{c.valor}</span>
                        </p>
                    ))}
                </div>
            )}

            {resultado?.nota && <p className="ficha-nota">{resultado.nota}</p>}

            <div className="resumen">
                <h2 className="resumen-titulo">Lo que practicó</h2>
                <ol className="resumen-lista">
                    {pasos.map((p) => (
                        <li key={p.orden}>{p.titulo}</li>
                    ))}
                </ol>
            </div>

            <button className="btn-primario" onClick={onRepetir}>
                Practicar de nuevo
            </button>
            <button className="btn-secundario" onClick={onMenu}>
                Elegir otro trámite
            </button>
        </section>
    );
}
