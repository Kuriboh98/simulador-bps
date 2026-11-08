# Simulador BPS

Simulador guiado de trámites del BPS, pensado para personas de 65+ que quieren
practicar un trámite **sin datos reales y sin consecuencias**. No es la página
oficial del BPS.

Trámite disponible: **Consultar fecha y lugar de cobro** (3 pasos: navegar al
trámite, ingresar los datos sobre la captura real, ver el resultado).

## Estructura

```
SimuladorBPS/
  backend/    API REST (Node + Express + Mongoose + MongoDB Atlas)
  frontend/   App web (React + Vite), mobile-first y accesible
```

## Correr en local

### Backend

```bash
cd backend
npm install
cp .env.example .env      # completar MONGO_URI con la cadena real de Atlas
npm run seed              # carga el trámite, los pasos y el escenario
npm run dev               # http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

El frontend lee la URL del backend desde `VITE_API_URL` (ver `.env.example`).
Si no se define, usa `http://localhost:3001`.

## Variables de entorno

| Dónde     | Variable       | Para qué                                         |
|-----------|----------------|--------------------------------------------------|
| backend   | `MONGO_URI`    | Cadena de conexión de MongoDB Atlas              |
| backend   | `PORT`         | Puerto del servidor (Render lo asigna solo)      |
| frontend  | `VITE_API_URL` | URL pública del backend desplegado               |

## Deploy

- **Base de datos:** MongoDB Atlas.
- **Backend:** Render (Web Service, root `backend`, start `npm start`),
  con la variable `MONGO_URI`.
- **Frontend:** Vercel (root `frontend`, framework Vite),
  con la variable `VITE_API_URL` apuntando al backend de Render.

Tras el primer deploy del backend, correr el seed una vez (desde local,
apuntando `MONGO_URI` a Atlas): `npm run seed`.

## Tests

```bash
cd backend
npm test
```

Vitest + Supertest + mongodb-memory-server (base en memoria, aislada).
