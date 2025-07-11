'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type PostcodeContextType = {
  serviceable: boolean | null;
  setServiceable: (val: boolean | null) => void;
  postcode: string;
  setPostcode: (val: string) => void;
};

const PostcodeContext = createContext<PostcodeContextType | undefined>(undefined);

export const PostcodeProvider = ({ children }: { children: React.ReactNode }) => {
  const [serviceable, setServiceableState] = useState<boolean | null>(null);
  const [postcode, setPostcodeState] = useState<string>('');

  useEffect(() => {
    const storedServiceable = localStorage.getItem('serviceable')
    const storedPostcode = localStorage.getItem('postcode')

    if (storedServiceable !== null) setServiceableState(storedServiceable === 'true')
    if (storedPostcode) setPostcodeState(storedPostcode)
  }, [])

  const setServiceable = (val: boolean | null) => {
    setServiceableState(val)
    if (val === null) {
      localStorage.removeItem('serviceable')
    } else {
      localStorage.setItem('serviceable', String(val))
    }
  }

  const setPostcode = (val: string) => {
    setPostcodeState(val)
    if (val === '') {
      localStorage.removeItem('postcode')
    } else {
      localStorage.setItem('postcode', val)
    }
  }

  return (
    <PostcodeContext.Provider value={{ serviceable, setServiceable, postcode, setPostcode }}>
      {children}
    </PostcodeContext.Provider>
  );
};

export const usePostcode = () => {
  const context = useContext(PostcodeContext);
  if (!context) throw new Error('usePostcode must be used within a PostcodeProvider');
  return context;
};
