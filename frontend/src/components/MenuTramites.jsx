import SwitchModo from './SwitchModo';

export default function MenuTramites({ tramites, error, modo, onCambiarModo, onElegir, onVolver }) {
    return (
        <div className="app">
            <main className="menu">
                <button className="btn-texto menu-volver" onClick={onVolver}>
                    ← Volver
                </button>
                <h1 className="menu-titulo">¿Qué quiere practicar?</h1>
                <p className="menu-sub">Elija un trámite y lo practicamos paso a paso.</p>

                <div className="menu-vista">
                    <span className="menu-vista-label">¿Cómo lo quiere ver?</span>
                    <SwitchModo modo={modo} onCambiar={onCambiarModo} />
                </div>

                {error && <p className="aviso-error">{error}</p>}

                <ul className="menu-lista">
                    {tramites.map((t) => (
                        <li key={t._id}>
                            <button className="tramite-card" onClick={() => onElegir(t._id)}>
                                <span className="tramite-card-texto">
                                    <span className="tramite-card-nombre">{t.nombre}</span>
                                    {t.descripcion && (
                                        <span className="tramite-card-desc">{t.descripcion}</span>
                                    )}
                                </span>
                                <span className="tramite-card-flecha" aria-hidden="true">
                                    →
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}
