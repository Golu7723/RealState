# RealEstate Frontend (React + Vite)

Modern React frontend for the Real Estate API.

## Tech

- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios (with JWT interceptor)
- Context API (auth)

## Getting started

From the `frontend` folder:

```bash
npm install
npm run dev
```

Vite will serve the app on `http://localhost:5173`.

## API

Base URL is configured in `src/services/api.js`:

- `http://localhost:8080/api`

### Endpoints used

- `GET /properties`
- `GET /properties/:id`
- `POST /properties` (JWT required)
- `PUT /properties/:id` (JWT required)
- `DELETE /properties/:id` (JWT required)
- `POST /contact`

### Auth endpoints (expected)

Auth is wired to:

- `POST /auth/login` → expects `{ token: "<jwt>" }` in response
- `POST /auth/register`

If your backend uses different paths or response shape, update `src/context/AuthContext.jsx`.

## Folder structure

```
src/
  components/
  context/AuthContext.jsx
  pages/
  routes/ProtectedRoute.jsx
  services/api.js
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

