import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Messenger from "./pages/Messenger";
import { UserProvider } from "./context/UserContext";
import { MessengerProvider } from "./context/MessengerContext";
import TermsOfUse from "./pages/TermsOfUse";
import PrivateRoute from "./utils/PrivateRoute";
import InvitationHandler from "./pages/InvitationHandler";



const App: React.FC = () => {
  const [isAuthenticated, setAuthenticated] = useState(false)

  return (
    <MessengerProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login setAuthenticated={setAuthenticated}/>} />
            <Route path="/invite/:invitationCode" element={<InvitationHandler setAuthenticated={setAuthenticated}/>} />

            <Route path="/messenger" element={
            <PrivateRoute isAuthenticated={isAuthenticated} children={<Messenger />}/>

            } />
            <Route path="/termsofuse" element={<TermsOfUse />} />
          </Routes>
        </Router>
      </UserProvider>
    </MessengerProvider>
  );
};

export default App;