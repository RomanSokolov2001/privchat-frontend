import React from 'react';

import {RootState} from "../redux/store";
import {useDispatch, useSelector} from "react-redux";

import { iconsRef } from '../utils/iconsRef';

import ButtonIcon from './buttons/ButtonIcon';
import HamburgerMenu from './animated/hamburgerMenu/HamburgerMenu';
import {setShowProfile, setShowSidebar} from "../redux/messengerSlice";


const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const isMobile = useSelector((state: RootState) => state.messenger.isMobile);
  const showSidebar = useSelector((state: RootState) => state.messenger.showSidebar);

  const dispatch = useDispatch();

  function changeShowSidebar(state: boolean) {
    dispatch(setShowSidebar(state));
  }

  function changeShowProfile(state: boolean) {
    dispatch(setShowProfile(state));
  }

  function onMenuClick() {
    changeShowSidebar(!showSidebar);
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
            <ButtonIcon icon={iconsRef.profile} onClick={() => changeShowProfile(true)} />
          </div>
          <a className={`pl-4 ${isMobile ? 'text-xl' : 'text-2xl'} font-black`}>
            {user && user.nickname}
          </a>
        </div>
        {!isMobile && (
            <a className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black ml-2`}>PrivChat</a>
        )}
        {!isMobile && <div></div>}
      </header>
  );
};

export default Header;
