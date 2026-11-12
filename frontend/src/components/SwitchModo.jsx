export default function SwitchModo({ modo, onCambiar }) {
    return (
        <div className="switch-modo" role="group" aria-label="Elegir cómo ver las pantallas">
            <button
                type="button"
                className={`switch-opcion ${modo === 'movil' ? 'activa' : ''}`}
                aria-pressed={modo === 'movil'}
                onClick={() => onCambiar('movil')}
            >
                Celular
            </button>
            <button
                type="button"
                className={`switch-opcion ${modo === 'web' ? 'activa' : ''}`}
                aria-pressed={modo === 'web'}
                onClick={() => onCambiar('web')}
            >
                Computadora
            </button>
        </div>
    );
}
