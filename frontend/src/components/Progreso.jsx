// Progreso.jsx — indicador "Paso X de N" + botones Volver y Salir.
export default function Progreso({ actual, total, onVolver, onSalir }) {
    return (
        <div className="progreso">
            <button className="btn-texto" onClick={onVolver} disabled={actual <= 1}>
                ← Volver
            </button>
            <span className="progreso-texto">
                Paso {actual} de {total}
            </span>
            <button className="btn-texto" onClick={onSalir}>
                Salir
            </button>
        </div>
    );
}
