# Adventure Tracker

A comprehensive trip planning and task-management web application with integrated calendar, todo list, and interactive map features.

## Overview

adventure-tracker is a full-stack web application designed to help users organize trips, manage tasks and appointments, and mark important locations on an interactive map. The application provides a seamless user experience with authentication, personalized dashboards, and intuitive interfaces for planning adventures and next-step todos.

## Features

### User Authentication
- **User Registration**: Create new accounts with email and password
- **Secure Login**: JWT-based authentication with bcrypt password hashing
- **Password Reset**: Forgot password functionality with secure token-based reset
- **Session Management**: 30-minute token expiration for security

### Todo Management
- **Create Todos**: Add tasks with title, description, and weather information
- **Filter Todos**: View all, completed, or open todos
- **Mark Complete**: Toggle task completion status
- **Delete Todos**: Remove completed or unnecessary tasks

### Event Calendar
- **Interactive Calendar**: Full calendar view with FullCalendar integration
- **Create Events**: Schedule events with title, date, start time, and end time
- **Day/Week/Month Views**: Multiple calendar view options
- **Event Management**: Delete and manage scheduled events

### Interactive Map
- **Place Markers**: Add custom markers on an interactive world map using Leaflet
- **Image Upload**: Attach multiple images to markers (up to 10 per marker)
- **Marker Details**: Add title and description to each location
- **Edit Markers**: Update marker descriptions
- **Bulk Operations**: Delete all markers or the most recent one

## Tech Stack

### Frontend
- **React 19.1.1**: Modern UI library
- **React Router DOM**: Client-side routing
- **Bootstrap 5**: Responsive design framework
- **FullCalendar**: Calendar component
- **React Big Calendar**: Alternative calendar view
- **Leaflet**: Interactive map library
- **React Leaflet**: React wrapper for Leaflet maps
- **Axios**: HTTP client for API requests
- **React Toastify**: Toast notifications
- **Lucide React**: Icon library

### Backend
- **Node.js**: Runtime environment
- **Express.js 5**: Web application framework
- **SQLite3**: Lightweight database
- **JSON Web Tokens (JWT)**: Authentication
- **bcrypt**: Password hashing
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Project Structure

```
adventure-tracker/
├── backend/                        # Node/Express API
│   ├── src/
│   │   ├── server.js              # Entry point for the backend
│   │   ├── database/
│   │   │   └── db.js              # SQLite setup and schema
│   │   ├── middlewares/
│   │   │   └── authenticate.js    # JWT auth middleware
│   │   ├── routes/                # Express routers
│   │   │   ├── todos.js
│   │   │   ├── events.js
│   │   │   └── markers.js
│   │   ├── controllers/           # (optional) business logic
│   │   └── config/                # configuration helpers
│   ├── uploads/                   # Static file storage
│   └── package.json               # backend dependencies & scripts
├── frontend/                       # React single‑page application
│   ├── public/
│   ├── src/
│   │   ├── Account/
│   │   ├── Design/
│   │   ├── Modals/
│   │   ├── Navigation/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── planner.db                      # SQLite database file (dev)
└── README.md                       # this document
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm 8+ (workspaces support) or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tanja2003/terminplanner.git
   cd adventure-tracker
   ```

2. **Install all dependencies**
   The repo uses npm workspaces, so one command installs both backend and frontend packages:
   ```bash
   npm run install-all   # or simply `npm install`
   ```

3. **Configure the backend**
   Create a `.env` file inside `backend/` with at least:
   ```env
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

4. **(Optional) Install individually**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

## Running the Application

### Start Backend Server
```
cd backend
npm run start          # or `npm run dev` with nodemon if installed
```
The server will run on `http://localhost:5000` (default port configurable via `.env`)

### Start Frontend Development Server
```bash
cd frontend
npm start
```
The application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/auth/forgotpassword` - Request password reset
- `POST /api/reset/password` - Reset password with token
- `GET /api/register/name` - Get user name (authenticated)

### Todos
- `GET /api/todos` - Get all todos for user
- `GET /api/todos/:filter` - Get filtered todos (done/open)
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo status
- `DELETE /api/todos/:id` - Delete todo

### Events
- `GET /api/events` - Get all events for user
- `POST /api/events` - Create new event
- `DELETE /api/events/:id` - Delete event

### Markers
- `GET /api/markers` - Get all markers with images
- `POST /api/markers` - Create marker with images
- `PUT /api/markers/:id` - Update marker description
- `DELETE /api/markers` - Delete last marker
- `DELETE /api/markers/all` - Delete all markers

## Database Schema

### Tables
- **account**: User accounts (id, name, email, password, resetToken, resetTokenExpire)
- **todos**: Task items (id, account_id, title, description, done, weather)
- **events**: Calendar events (id, account_id, title, date, start, end)
- **markers**: Map markers (id, account_id, lat, lng, title, description)
- **marker_images**: Images for markers (id, marker_id, image_url)

## Features in Detail

### Todo List
- Weather-aware task planning
- Status filtering (all/done/open)
- Quick status toggle
- Clean and intuitive interface

### Calendar
- Multiple view modes (day, week, month)
- Time-based event scheduling
- Drag-and-drop event management
- Color-coded events

### World Map
- Interactive Leaflet-based map
- Click to add markers
- Multiple image uploads per location
- Persistent marker storage
- Visual location tracking

## Security Features
- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Token expiration (30 minutes)
- Secure password reset with time-limited tokens (15 minutes)
- Protected API routes with authentication middleware
- SQL injection prevention with parameterized queries
- CORS enabled for secure cross-origin requests


## 👥 Author
Created by [tanja2003](https://github.com/tanja2003)
