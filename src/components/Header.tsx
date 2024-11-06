// Header.tsx
import React from 'react';

interface HeaderProps {
  userNickname: string | null;
  chatNickname: string;
}

const Header: React.FC<HeaderProps> = ({ userNickname, chatNickname }) => {
  return (
    <header style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <h2>{userNickname}</h2>
      <h4>Chat with: {chatNickname}</h4>
    </header>
  );
};

export default Header;
