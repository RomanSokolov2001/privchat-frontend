import React, { useEffect, useState } from "react";
import { useMessenger } from "../context/MessengerContext";
import { animated, useSpring } from "@react-spring/web";
import { useUser } from "../context/UserContext";
import { BASE_URL, FRONTEND_URL} from "../config";
import { MessengerAPI } from "../api/MessengerAPI";

const Profile = () => {
  const { showProfile, setShowProfile } = useMessenger();
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  const inviteLink = `${FRONTEND_URL}/invite/${user?.nickname}`
  
  const [bgSprings, bgApi] = useSpring(() => ({
    opacity: 0,
    config: { tension: 400, friction: 20 },
  }));
  
  const [contentSprings, contentApi] = useSpring(() => ({
    opacity: 0,
    transform: "scale(0.9)",
    config: { tension: 400, friction: 20 },
  }));

  useEffect(() => {
    if (showProfile) {
      bgApi.start({ opacity: 1 });
      contentApi.start({
        opacity: 1,
        transform: "scale(1)"
      });
    } else {
      bgApi.start({ opacity: 0 });
      contentApi.start({
        opacity: 0,
        transform: "scale(0.9)"
      });
    }
  }, [showProfile, bgApi, contentApi]);

  const onClose = () => {
    bgApi.start({ opacity: 0 });
    contentApi.start({
      opacity: 0,
      transform: "scale(0.9)"
    });
    setShowProfile(false);
  };

  const getTimeRemaining = (): string => {
    if (!user?.expiresIn) return '';
    const now = Date.now();
    const diff = user.expiresIn - now;
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!showProfile) return null;

  return (
    <animated.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[999]"
      style={bgSprings}
      onClick={onClose}
    >
      <animated.div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
        style={contentSprings}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Profile</h2>
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Close profile"
            >
              X
            </button>
          </div>

          {/* User Nickname */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nickname</label>
            <div className="text-lg font-medium">{user?.nickname}</div>
          </div>

          <div className="space-y-4">
            {/* Temporary Account Status */}
            <div className="bg-orange-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <span className="inline-block px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 rounded-full">
                    Temporary Account
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-orange-600">
                <span>Session expires in {getTimeRemaining()}</span>
              </div>
            </div>

            {/* Invitation Link Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Send secret chat invitation link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="flex-1 p-2 text-sm bg-gray-50 rounded border border-gray-200 focus:outline-none"
                />
                <button
                  onClick={copyInviteLink}
                  className="flex items-center space-x-1 px-3 py-2 bg-[#4f4f4f] text-white rounded hover:bg-[#383838] transition-colors w-[70px] justify-center"
                >
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
};

export default Profile;