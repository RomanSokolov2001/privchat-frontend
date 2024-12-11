import React from 'react';
import HamburgerMenu from './animated/hamburgerMenu/HamburgerMenu';
import { useMessenger } from '../context/MessengerContext';

interface HeaderProps {
  userNickname: string | null | undefined;
  chatNickname: string;
}

const Header: React.FC<HeaderProps> = ({ userNickname='userNick123', chatNickname='otherUser123' }) => {
  const {setShowSidebar, isMobile} = useMessenger()

  function onMenuClick() {
    setShowSidebar(prev => !prev)
  }

  return (
    <header className='bg-[#4f4f4f] flex flex-row text-white pt-3 pb-3 justify-between shadow-2xl h-[80px] items-center pr-10'>
      <div className='flex flex-row items-center'>
        {isMobile && <div className='justify-center flex pl-10'><HamburgerMenu onClick={onMenuClick}/></div> }
        <a className='text-2xl font-black pl-4'>{userNickname}</a>
      </div>
      
      <a className={'text-2xl font-black'}>PrivChat</a>
      <div> </div>
    </header>
  );
};

export default Header;