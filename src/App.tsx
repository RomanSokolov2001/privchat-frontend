import React from "react";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Messenger from "./pages/Messenger";
import { UserProvider } from "./context/UserContext";
import { MessengerProvider } from "./context/MessengerContext";


const App: React.FC = () => {
  return (
    <MessengerProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/messenger" element={<Messenger />} />
          </Routes>
        </Router>
      </UserProvider>
    </MessengerProvider>
  );
};

export default App;