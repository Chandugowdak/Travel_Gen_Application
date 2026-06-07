# API Handling Instructions

Purpose
------
This file describes the agreed format for exposing the backend API port and how the frontend should consume the backend during development and production.

Backend (server)
-----------------
- **Port configuration**: The backend must read its listening port from `process.env.PORT` with a fallback default. Example (Node/Express, `Main.js`):

  ```js
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  ```

- **.env**: Add `PORT=3000` (or your chosen port) to the backend `.env` for local development. Do not commit secrets.

- **CORS**: Ensure the backend enables CORS for the frontend origin during development, or use a dev proxy in the frontend (see below).

Frontend (Vite / React)
----------------------
- **Environment variables (Vite)**: Use Vite environment variables prefixed with `VITE_`. Create `frontend/.env` (gitignored) and set a base URL or full URL including port, for example:

  ```text
  VITE_API_BASE_URL=http://localhost:3000/api
  ```

- **Access in code**: Use `import.meta.env.VITE_API_BASE_URL` in the frontend. Provide a fallback for safety.

  Example `src/services/apiProvider.js` (axios):

  ```js
  import axios from 'axios';

  const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const api = axios.create({
    baseURL: BASE,
    withCredentials: true,
  });

  export default api;
  ```

  Example (fetch wrapper):

  ```js
  const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  export async function apiFetch(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    return res.json();
  }
  ```

- **Vite dev proxy (optional)**: Instead of hardcoding ports in dev, proxy `/api` requests to the backend port. Add to `vite.config.js`:

  ```js
  // vite.config.js
  export default defineConfig({
    server: {
      proxy: {
        '/api': 'http://localhost:3000',
      },
    },
  });
  ```

  With this proxy you can use relative paths like `/api/auth/login` from the frontend and avoid CORS during development.

Recommendations and best practices
----------------------------------
- Use `VITE_API_BASE_URL` for production builds to point at the deployed API (e.g., `https://api.example.com`).
- Keep environment variables out of version control. Add example env files like `.env.example` if helpful.
- Prefer a single `BASE` value in `apiProvider.js` so all API calls use the same origin and are easy to update.

Next steps I can take for you
---------------------------
- Patch `frontend/src/services/apiProvider.js` to use the `import.meta.env.VITE_API_BASE_URL` pattern and a safe fallback.
- Add a `frontend/.env.example` and `backend/.env.example` showing `VITE_API_BASE_URL` and `PORT`.
