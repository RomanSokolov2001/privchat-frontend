import React from 'react';
import HamburgerMenu from './animated/hamburgerMenu/HamburgerMenu';
import { useMessenger } from '../context/MessengerContext';
import Icon from './Icon';
import { iconsRef } from '../utils/iconsRef';
import ButtonIcon from '../buttons/ButtonIcon';

interface HeaderProps {
  userNickname: string | null | undefined;
  chatNickname: string;
}

const Header: React.FC<HeaderProps> = ({ userNickname = 'userNick123', chatNickname = 'otherUser123' }) => {
  const { setShowSidebar, isMobile, setShowProfile } = useMessenger();

  function onMenuClick() {
    setShowSidebar((prev) => !prev);
  }

  return (
    <header className='bg-[#4f4f4f] flex flex-row text-white pt-3 pb-3 justify-between shadow-2xl h-[80px] items-center pr-10'>
      <div className='flex flex-row items-center'>
        {isMobile && (
          <div className='justify-center flex pl-2'>
            <HamburgerMenu onClick={onMenuClick} />
          </div>
        )}
        <div className='pl-2'>
          <ButtonIcon icon={iconsRef.profile} onClick={() => setShowProfile(true)} />
        </div>
        <a className={`pl-4 ${isMobile ? 'text-xl' : 'text-2xl'} font-black`}>
          {userNickname}
        </a>
      </div>

      <a className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black ml-2`}>PrivChat</a>
      {!isMobile && <div></div>}
    </header>
  );
};

export default Header;
