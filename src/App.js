import './App.css';
import LoginForm from './Skills/LoginForm';
import SignupForm from './Skills/SignupForm';
import Home from './Skills/Home';
import Navbar from './Skills/Navbar';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
          <Navbar />
        <Routes>
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/signup" element={<SignupForm/>} />
           <Route path="/" element={<Navigate to="/login" />} />
           <Route path="/home" element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
