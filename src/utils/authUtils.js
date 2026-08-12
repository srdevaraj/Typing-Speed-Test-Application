const TOKEN_KEY = "typing_speed_test_token";

/**
 * Get JWT token.
 *
 * Checks localStorage first and then sessionStorage.
 */
export const getToken = () => {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY)
  );
};

/**
 * Save JWT token.
 *
 * rememberMe = true  -> localStorage
 * rememberMe = false -> sessionStorage
 */
export const setToken = (token, rememberMe = true) => {
  if (!token) {
    return;
  }

  removeToken();

  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Remove JWT token from both storage locations.
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

/**
 * Check whether the user currently has a JWT.
 */
export const isAuthenticated = () => {
  return Boolean(getToken());
};