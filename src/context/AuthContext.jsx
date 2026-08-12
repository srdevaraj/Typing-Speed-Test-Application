import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getToken,
  removeToken,
  setToken as saveToken,
} from "../utils/authUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => getToken());

  const isAuthenticated = Boolean(token);

  /**
   * Login and synchronize React state with storage.
   */
  const login = (newToken, rememberMe = true) => {
    saveToken(newToken, rememberMe);
    setTokenState(newToken);
  };

  /**
   * Logout.
   */
  const logout = () => {
    removeToken();
    setTokenState(null);
  };

  /**
   * Synchronize authentication state if storage
   * changes from another browser tab.
   */
  useEffect(() => {
    const handleStorageChange = () => {
      setTokenState(getToken());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};