import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";

import Navbar1 from "./Design/Navigation";
import TodoPage from "./pages/TodoPage";
import CalenderPage from "./pages/CalenderPage";
import Login from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <Navbar1 />
      <Routes>
        <Route path="/login/" element={<Login />}/>
        <Route path="/" element={<HomePage />} />
        <Route path="/calender" element={<CalenderPage />} />
        <Route path="/todo" element={<TodoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
