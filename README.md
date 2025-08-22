# MIS Project 1

A web-based Maintenance Information System (MIS) for Reneta Precision Project. This project includes a Progressive Web App (PWA) frontend and a Node.js backend server.

## Project Structure

```
MIS_Project1/
├── db/                # Database schema and related files
│   └── schema.sql
├── mis-pwa/           # Frontend Progressive Web App (React + Vite + Tailwind)
│   ├── index.html
│   ├── package.json
│   ├── src/
│   │   ├── main.jsx
│   │   ├── styles.css
│   │   └── modules/
│   │       ├── App.jsx
│   │       ├── PM.jsx
│   │       ├── Spares.jsx
│   │       ├── Utilities.jsx
│   │   └── shared/
│   │       ├── api.js
│   │       ├── auth.js
│   │       ├── outbox.js
│   │       ├── push.js
│   │       └── supabase.js
│   └── public/
│       ├── manifest.webmanifest
│       ├── offline.html
│       └── sw.js
├── server/            # Backend server (Node.js)
│   ├── package.json
│   └── src/
│       └── index.js
└── .gitignore         # Git ignore file
```

## Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- npm

### Setup
1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd MIS_Project1
   ```
2. **Install frontend dependencies:**
   ```sh
   cd mis-pwa
   npm install
   ```
3. **Run the frontend (PWA):**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (default Vite port).

4. **Install backend dependencies:**
   ```sh
   cd ../server
   npm install
   ```
5. **Run the backend server:**
   ```sh
   npm start
   ```

## Features
- Asset management
- Preventive maintenance (PM)
- Breakdown logging
- Spares and utilities tracking
- Role-based authentication
- Offline support (PWA)

## Database
- The database schema is located in `db/schema.sql`.
- Backend integration and Supabase setup are not yet connected.

## Notes
- Supabase integration is planned but not yet implemented. All Supabase-related code is currently disabled.
- For development, you can work with the UI and static features until backend and database are connected.

## License
This project is for internal use at Reneta Precision Project. License details to be added.
