import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../api/AuthService";
import DiffieHellmanService from "../api/DiffieHellmanService";
import { useUser } from "../context/UserContext";
import Button from "../components/Button";
import { iconsRef } from "../utils/iconsRef";
import Checkbox from "../components/checkbox/Checkbox";
import { useMessenger } from "../context/MessengerContext";
import Toast from "../components/Toast";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { areTermsAccepted, setTermsAccepted } = useMessenger()
  const [showToast, setShowToast] = useState(false)
  const { setUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    if (!areTermsAccepted) {
      setShowToast(true)
      return
    }
    e.preventDefault();
    try {
      const credentials = await AuthService.enterPool();
      const { publicKey, secret } = DiffieHellmanService.handleGenerateKeys();
      setUser({ jwt: credentials.token, nickname: credentials.nickname, publicKey, secretKey: String(secret) });
      navigate("/messenger");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. No response from server.");
    }
  };

  return (
    <Body>
      <LoginWindow handleLogin={handleLogin} setState={setShowInfoModal} state={showInfoModal} />
      {showToast &&
        <Toast isVisible={showToast} toggleVisible={() => setShowToast(!showToast)}
          header={"Terms of Use Required"}
          text={"You must agree to the Terms of Use before proceeding with authorization."}
        />}
    </Body>
  );
};

export default Login;

const LoginWindow = ({ handleLogin, setState, state }: { handleLogin: (e: React.FormEvent) => void, setState: Dispatch<SetStateAction<boolean>>, state: boolean }) => {

  async function runAnimation() {
    setState(true)
    await sleep(4000)
    setState(false)

    function sleep(time: number | undefined) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }
  }

  return (
    <WhiteFrame>
      <div className="flex flex-row justify-center items-center pb-40">
        <h2 className="text-2xl font-semibold text-center">PrivChat</h2>
        <div >
          <Icon icon={iconsRef.info} setState={setState} onClick={runAnimation} />
          <InfoModal isVisible={state} />
        </div>


      </div>
      <Button text={"Enter Pool"} onClick={handleLogin} />
      <TermsAndConditions />
    </WhiteFrame>
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

const Icon = ({ icon, setState, onClick }: { icon: string, setState: (state: boolean) => void, onClick: () => void }) => {
  const width = 40;
  const height = 40;

  return (
    <img
      src={icon}
      width={width}
      height={height}
      onMouseEnter={() => setState(true)}
      onMouseLeave={() => setState(false)}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    />
  );
};

const InfoModal = ({ isVisible }: { isVisible: boolean }) => {
  const [animationClass, setAnimationClass] = useState('')

  useEffect(() => {
    if (isVisible) {
      setAnimationClass('modal-show')
    } else {
      setAnimationClass('modal-hide')
    }
  }, [isVisible]);

  const ArrowUp = () => {
    const styles = {
      width: 0,
      height: 0,
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderBottom: '10px solid rgba(212, 213, 214, 0.8)',
    };

    return <div style={styles} className="absolute top-[-10px] left-[10px]" />;
  };

  return (
    <>
      <div
        className={`p-4 max-w-[200px] absolute rounded-md shadow-xl modal ${animationClass}`}
        style={{
          backgroundColor: 'rgba(212, 213, 214, 0.8)'
        }}
      >
        <ArrowUp />
        <p className="font-roboto font-normal">Here is the information about the application. Use end-to-end encryption without registration.</p>
      </div>
    </>

  );
};

const TermsAndConditions = () => {
  const { areTermsAccepted, setTermsAccepted } = useMessenger()
  function onClick() {
    setTermsAccepted(!areTermsAccepted)
  }
  return (
    <div className="flex flex-row items-center gap-5 pt-4">
      <Checkbox state={areTermsAccepted} setState={onClick} />
      <div>
        <a>I have read and understand </a>
        <Link to="/termofuse" className="text-blue-500 underline hover:text-blue-700">
          Terms of Use
        </Link>
      </div>
    </div>
  );
};
