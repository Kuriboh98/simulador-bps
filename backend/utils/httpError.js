// utils/httpError.js — helper para errores con código HTTP.
// El manejador de errores de app.js lee err.status.
export function httpError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}
