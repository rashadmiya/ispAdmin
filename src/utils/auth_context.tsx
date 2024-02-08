import React, { createContext } from 'react';

interface CurrentUserContextType {
  signIn: any,
  signOut: any,
  signUp: any,
}
export const AuthContext = createContext<Partial<CurrentUserContextType>>({});


// import React from 'react';

// export const AuthContext = React.createContext({});