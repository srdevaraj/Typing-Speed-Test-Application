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

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  const isAuthenticated = Boolean(token);

  /**
   * Login and synchronize React state with storage.
   */
  const login = (
    newToken,
    username = null,
    email = null,
    rememberMe = true
  ) => {
    saveToken(newToken, rememberMe);

    setTokenState(newToken);

    const userData = {
      username,
      email,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  /**
   * Logout.
   */
  const logout = () => {
    removeToken();

    localStorage.removeItem("user");

    setTokenState(null);
    setUser(null);
  };

  /**
   * Synchronize authentication state if storage
   * changes from another browser tab.
   */
  useEffect(() => {
    const handleStorageChange = () => {
      setTokenState(getToken());

      const storedUser =
        localStorage.getItem("user");

      setUser(
        storedUser
          ? JSON.parse(storedUser)
          : null
      );
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

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
        user,
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