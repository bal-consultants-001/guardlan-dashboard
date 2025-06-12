'use client';

import { createContext, useContext, useState } from 'react';

type PostcodeContextType = {
  serviceable: boolean | null;
  setServiceable: (val: boolean | null) => void;
};

const PostcodeContext = createContext<PostcodeContextType | undefined>(undefined);

export const PostcodeProvider = ({ children }: { children: React.ReactNode }) => {
  const [serviceable, setServiceable] = useState<boolean | null>(null);

  return (
    <PostcodeContext.Provider value={{ serviceable, setServiceable }}>
      {children}
    </PostcodeContext.Provider>
  );
};

export const usePostcode = () => {
  const context = useContext(PostcodeContext);
  if (!context) throw new Error('usePostcode must be used within a PostcodeProvider');
  return context;
};
