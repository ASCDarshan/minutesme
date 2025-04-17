import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { app } from '../firebase/config';

// Create the auth context
const AuthContext = createContext();

// Create a hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth(app);

  // Sign in with Google
  const login = async () => {
    setError(null);
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign-in error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    setError(null);
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [auth]);

  // Values to provide in the context
  const value = {
    currentUser,
    login,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;