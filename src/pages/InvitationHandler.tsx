import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthAPI } from "../api/AuthAPI";
import DiffieHellmanService from "../services/DiffieHellmanService";
import { useUser } from "../context/UserContext";
import Button from "../components/Button";
import Checkbox from "../components/checkbox/Checkbox";
import { useMessenger } from "../context/MessengerContext";
import Toast from "../components/Toast";


const InvitationHandler = ({ setAuthenticated }: { setAuthenticated: (value: boolean) => void }) => {
  const navigate = useNavigate();
  const { invitationCode } = useParams();
  const [showToast, setShowToast] = useState(false);
  const { areTermsAccepted, setTermsAccepted } = useMessenger();
  const { setUser } = useUser();

  // Extract invitation info from the invite code
  const decodedInviteCode = React.useMemo(() => {
    if (!invitationCode) {
      return { nickname: '', isValid: false };
    }

    try {
      const nickname = invitationCode
      return {
        nickname: nickname,
        isValid: nickname.length > 0
      };
    } catch (error) {
      console.error("Invalid invitation code:", error);
      return { nickname: '', isValid: false };
    }
  }, [invitationCode]);

  useEffect(() => {
    if (!invitationCode || !decodedInviteCode.isValid) {
  
      navigate('/'); // Redirect to home if invite code is invalid or missing
    }
  }, [invitationCode, decodedInviteCode.isValid, navigate]);

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    if (!invitationCode) {
      navigate('/');
      return;
    }

    if (!areTermsAccepted) {
      setShowToast(true);
      return;
    }

    e.preventDefault();
    try {
      const credentials = await AuthAPI.enterPool();
      const { publicKey, secret } = DiffieHellmanService.handleGenerateKeys();
      
      setUser({
        jwt: credentials.token,
        nickname: credentials.nickname,
        publicKey,
        secretKey: String(secret),
        expiresIn: credentials.expiresIn,
        invitationLink: invitationCode
      });
      
      setAuthenticated(true);
      navigate("/messenger", {
        state: {
            invitationCode: invitationCode
        }
      });
   
    } catch (error) {
      console.error("Failed to accept invitation:", error);
      alert("Failed to accept invitation. Please try again.");
    }
  };

  if (!invitationCode || !decodedInviteCode.isValid) {
    return null;
  }

  return (
    <Body>
      <WhiteFrame>
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-semibold text-center">PrivChat Invitation</h2>
          <p className="text-center text-gray-600">
            You've been invited by <span className="font-semibold">{decodedInviteCode.nickname}</span> to join a private chat
          </p>
          <Button text="Accept Invitation" onClick={handleAcceptInvitation} />
          <TermsAndConditions />
        </div>
      </WhiteFrame>
      {showToast && (
        <Toast 
          isVisible={showToast}
          toggleVisible={() => setShowToast(!showToast)}
          header="Terms of Use Required"
          text="You must agree to the Terms of Use before accepting the invitation."
        />
      )}
    </Body>
  );
};

const WhiteFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-between p-20 bg-white min-h-[200px] rounded-xl">
      {children}
    </div>
  );
};

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-gray-200">
      {children}
    </div>
  );
};

const TermsAndConditions = () => {
  const { areTermsAccepted, setTermsAccepted } = useMessenger();
  
  function onClick() {
    setTermsAccepted(!areTermsAccepted);
  }
  
  return (
    <div className="flex flex-row items-center gap-5 pt-4">
      <Checkbox state={areTermsAccepted} setState={onClick} />
      <div>
        <span>I have read and understand </span>
        <Link to="/termofuse" className="text-blue-500 underline hover:text-blue-700">
          Terms of Use
        </Link>
      </div>
    </div>
  );
};

export default InvitationHandler;