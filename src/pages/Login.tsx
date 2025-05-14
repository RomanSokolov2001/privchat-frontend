import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import {authService} from "../appServices/AuthService";
import {RootState} from "../redux/store";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../redux/userSlice";

import {User} from "../utils/types";

import Button from "../UI/buttons/Button";
import Toast from "../UI/modals/Toast";
import TermsAndConditions from "../UI/parts/loginParts/TermsAndConfitions";
import WhiteFrame from "../UI/parts/WhiteFrame";
import PageBackground from "../UI/parts/PageBackground";
import {Alert} from "@mui/material";


const Login = () => {
    const navigate = useNavigate();
    const areTermsAccepted = useSelector((state: RootState) => state.messenger.areTermsAccepted);
    const dispatch = useDispatch();
    const [showToast, setShowToast] = useState(false)

    function changeUser(user: User) {
        dispatch(setUser(user));
    }

    const handleLogin = async (e: React.FormEvent) => {
        if (!areTermsAccepted) {
            return setShowToast(true)
        }
        e.preventDefault();
        try {

            await authService.handleLogin(changeUser)
            navigate("/messenger");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. No response from server.");
        }
    };

    const LoginWindow = () =>
        <WhiteFrame>
            <h2 className="text-2xl font-semibold text-center pb-[20px]">PrivChat</h2>
            <p className="text-xl "> - Have a <b>disposable</b> chat</p>
            <p className="text-xl">- <b>End to end</b> encryption</p>
            <p className="text-xl ">- Only you and <b>you own</b> the encryption <b>keys</b></p>
            <p className="text-xl">- <b>No</b> messages stored!</p>
            <p className="text-xl pb-[20px]">- Send <b>files</b> and <b>photos!</b></p>

            <Button text={"Enter Pool"} onClick={handleLogin}/>
            <TermsAndConditions/>
        </WhiteFrame>

    return (
        <PageBackground>
            <LoginWindow/>
            {showToast &&
                <Toast isVisible={showToast} toggleVisible={() => setShowToast(!showToast)}
                       header={"Terms of Use Required"}
                       text={"You must agree to the Terms of Use before proceeding with authorization."}
                />}
        </PageBackground>
    );
};

export default Login;
