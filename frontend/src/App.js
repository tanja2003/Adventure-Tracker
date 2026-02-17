import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import TodoPage from "./pages/TodoPage";
import CalenderPage from "./pages/CalenderPage";
import Login from "./Account/LoginPage";
import { isTokenValid, ProtectedRoute } from "./ProtectedRoutes";
import Register from "./Account/Register";
import LogoutModal from "./Account/Logout";
import useAutoLogout from "./Account/AutoLogout";
import 'leaflet/dist/leaflet.css';
import Navbar2 from "./Navigation/Navbar2";
import { AuthProvider } from "./Navigation/Authprovider";
import NavbarSwitcher from "./Account/NavbarSwitcher";
import ChangePassword from "./Account/ChangePassword";
import ForgotPassword from "./Account/ForgotPassword";
import ResetPage from "./Account/ResetPasswordPage";

const ProfilePage = () => <div className="font-bold" style={{ fontSize:"22px", margin:20}}>not yet implemented</div>;

function App() {
  //useAutoLogout(300000);
  const isLoggedIn = isTokenValid();
  return (
    <AuthProvider>
      <Router>
        <NavbarSwitcher></NavbarSwitcher>
        <Routes>
          <Route path="/reset/:token" element={<ResetPage />} />
          <Route path="/register/" element={<Register />} />
          <Route path="/login/" element={<Login />}/>
          <Route path="/forgotpassword" element={<ForgotPassword/>}/>
          <Route path="/changepassword/" element={<ChangePassword/>}/>
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
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
        </Routes>
      </Router>
    </AuthProvider>
    
  );
}
export default App;
