# Terminplanner 📅

A comprehensive appointment planning and task management web application with integrated calendar, todo list, and interactive map features.

## 📋 Overview

Terminplanner is a full-stack web application designed to help users organize their daily tasks, schedule events, and mark important locations on an interactive map. The application provides a seamless user experience with authentication, personalized dashboards, and intuitive interfaces for managing appointments and todos.

## ✨ Features

### 🔐 User Authentication
- **User Registration**: Create new accounts with email and password
- **Secure Login**: JWT-based authentication with bcrypt password hashing
- **Password Reset**: Forgot password functionality with secure token-based reset
- **Session Management**: 30-minute token expiration for security

### ✅ Todo Management
- **Create Todos**: Add tasks with title, description, and weather information
- **Filter Todos**: View all, completed, or open todos
- **Mark Complete**: Toggle task completion status
- **Delete Todos**: Remove completed or unnecessary tasks

### 📆 Event Calendar
- **Interactive Calendar**: Full calendar view with FullCalendar integration
- **Create Events**: Schedule events with title, date, start time, and end time
- **Day/Week/Month Views**: Multiple calendar view options
- **Event Management**: Delete and manage scheduled events

### 🗺️ Interactive Map
- **Place Markers**: Add custom markers on an interactive world map using Leaflet
- **Image Upload**: Attach multiple images to markers (up to 10 per marker)
- **Marker Details**: Add title and description to each location
- **Edit Markers**: Update marker descriptions
- **Bulk Operations**: Delete all markers or the most recent one

## 🛠️ Tech Stack

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

## 📁 Project Structure

```
terminplanner/
├── backend/
│   ├── index.js           # Main server file
│   ├── db.js              # Database configuration
│   ├── authenticate.js    # JWT authentication middleware
│   ├── routes/
│   │   ├── todos.js       # Todo CRUD operations
│   │   ├── events.js      # Event CRUD operations
│   │   ├── markers.js     # Map marker operations
│   │   └── account.js     # Account management
│   ├── uploads/           # Uploaded images directory
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.js     # Main dashboard
│   │   │   ├── TodoPage.js     # Todo list view
│   │   │   └── CalendarPage.js # Calendar view
│   │   ├── Navigation/         # Navigation components
│   │   ├── Account/            # Authentication components
│   │   ├── Modals/             # Modal dialogs
│   │   ├── Design/             # UI components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── planner.db             # SQLite database file
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tanja2003/terminplanner.git
   cd terminplanner
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

4. **Create environment file**
   
   Create a `.env` file in the `backend` directory:
   ```env
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

5. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

## 🏃 Running the Application

### Start Backend Server
```bash
cd backend
node index.js
```
The server will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm start
```
The application will open at `http://localhost:3000`

## 🔌 API Endpoints

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

## 💾 Database Schema

### Tables
- **account**: User accounts (id, name, email, password, resetToken, resetTokenExpire)
- **todos**: Task items (id, account_id, title, description, done, wheater)
- **events**: Calendar events (id, account_id, title, date, start, end)
- **markers**: Map markers (id, account_id, lat, lng, title, description)
- **marker_images**: Images for markers (id, marker_id, image_url)

## 🎨 Features in Detail

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

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Token expiration (30 minutes)
- Secure password reset with time-limited tokens (15 minutes)
- Protected API routes with authentication middleware
- SQL injection prevention with parameterized queries
- CORS enabled for secure cross-origin requests

## 📝 License

This project is open source and available for educational purposes.

## 👥 Author

Created by [tanja2003](https://github.com/tanja2003)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📧 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using React and Node.js**
