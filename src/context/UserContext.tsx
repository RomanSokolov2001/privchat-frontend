import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  nickname: string;
  email?: string;
  jwt: string;
  secretKey: string;
  publicKey: string;
  expiresIn: number;
  invitationLink?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: Partial<User> | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  const setUser = (updatedFields: Partial<User> | null) => {
    setUserState((prevUser) => {
      if (updatedFields === null) return null;
      if (prevUser === null) return { ...updatedFields } as User;

      return { ...prevUser, ...updatedFields } as User;
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
