# Backend (API)

The `backend` directory contains a Node.js/Express REST API that serves the data for the travel‑planner application. The server uses SQLite for storage and JWT for stateless authentication.

## Structure

```
backend/
├── src/
│   ├── server.js              # entrypoint
│   ├── database/
│   │   └── db.js              # sqlite setup & schema
│   ├── middlewares/
│   │   └── authenticate.js    # JWT verification
│   ├── routes/                # express routers
│   │   ├── account.js         # auth/register/login/reset
│   │   ├── todos.js
│   │   ├── events.js
│   │   └── markers.js
│   ├── controllers/           # business logic (empty placeholder)
│   └── config/                # configuration helpers
├── uploads/                   # user uploads (images)
└── package.json               # dependencies & scripts
```

## Running

Install dependencies:

```bash
cd backend
npm install
```

Start the API:

```bash
npm run start      # production
npm run dev        # development (needs nodemon)
```

Port and JWT secret are configured via `.env`.

## Notes

- The database file (`planner.db`) is created in the workspace root by default. It is ignored by git.
- Uploaded images are stored in `backend/uploads` and served statically.
- Additional business logic can be placed under `controllers` for clarity.
