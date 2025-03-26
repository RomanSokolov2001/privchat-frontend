import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../redux/userSlice";
import {RootState} from "../redux/store";
import {authService} from "../appServices/AuthService";

import {User} from "../utils/types";

import Button from "../UI/buttons/Button";
import TermsAndConditions from "../UI/parts/loginParts/TermsAndConfitions";
import WhiteFrame from "../UI/parts/WhiteFrame";
import PageBackground from "../UI/parts/PageBackground";
import Toast from "../UI/modals/Toast";


const InvitationHandler = () => {
  const navigate = useNavigate();
  const { invitationCode } = useParams();
  const [showToast, setShowToast] = useState(false);
  const areTermsAccepted = useSelector((state: RootState) => state.messenger.areTermsAccepted);
  const dispatch = useDispatch();

  function changeUser(user: User) {
    dispatch(setUser(user));
  }

  useEffect(() => {
    if (!invitationCode) {
      navigate('/');
    }
  }, [invitationCode, navigate]);

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    if (!invitationCode) {
      return navigate('/');
    }

    if (!areTermsAccepted) {
      return setShowToast(true);
    }

    e.preventDefault();
    try {
      await authService.acceptInvite(invitationCode, changeUser);

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

  return (
    <PageBackground>
      <WhiteFrame>
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-semibold text-center">PrivChat Invitation</h2>
          <p className="text-center text-gray-600">
            You've been invited by <span className="font-semibold">{invitationCode}</span> to join a private chat
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
    </PageBackground>
  );
};

export default InvitationHandler;
