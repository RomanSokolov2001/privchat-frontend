import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import {Provider} from "react-redux";
import {store} from "./redux/store";

import Login from "./pages/Login";
import Messenger from "./pages/Messenger";
import InvitationHandler from "./pages/InvitationHandler";
import TermsOfUse from "./pages/TermsOfUse";
import PrivateRoute from "./utils/PrivateRoute";


const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/invite/:invitationCode"
                           element={<InvitationHandler/>}/>

                    <Route path="/messenger" element={
                        <PrivateRoute children={<Messenger/>}/>
                    }/>
                    <Route path="/termsofuse" element={<TermsOfUse/>}/>
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
