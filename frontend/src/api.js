const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '');

async function req(path, options = {}) {
    const res = await fetch(BASE + path, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
}

export const getTramites = () => req('/api/tramites');
export const getTramite = (id) => req(`/api/tramites/${id}`);
export const crearSesion = (tramiteId) =>
    req('/api/sesiones', { method: 'POST', body: JSON.stringify({ tramiteId }) });
export const validar = (sesionId, campos) =>
    req(`/api/sesiones/${sesionId}/validar`, { method: 'POST', body: JSON.stringify({ campos }) });
