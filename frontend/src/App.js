import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";

import Navbar1 from "./Design/Navigation";
import TodoPage from "./pages/TodoPage";
import CalenderPage from "./pages/CalenderPage";
import Login from "./Account/LoginPage";
import { ProtectedRoute } from "./ProtectedRoutes";
import Register from "./Account/Register";
import LogoutModal from "./Account/Logout";
import useAutoLogout from "./Account/AutoLogout";
// <-- wichtig: Default-Icon setzen
import 'leaflet/dist/leaflet.css';

function App() {
  //useAutoLogout(300000);
  return (
    <Router>
      <Navbar1 />
      <Routes>
        <Route path="/register/" element={<Register />} />
        <Route path="/login/" element={<Login />}/>
        <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
        <Route path="/calender" element={
            <ProtectedRoute>
              <CalenderPage />
            </ProtectedRoute>
          } />
        <Route path="/todo" element={
            <ProtectedRoute>
              <TodoPage />
            </ProtectedRoute>
          } />
        <Route path="/logout" element={
            <ProtectedRoute>
              <LogoutModal />
            </ProtectedRoute>
          } />
      </Routes>
    </Router>
  );
}

export default App;
