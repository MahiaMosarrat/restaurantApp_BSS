import { createContext, useContext } from "react";

export function getAuthInfo() {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const refreshTokenExpiryTime = localStorage.getItem("expTime");
  const userInfo = localStorage.getItem("userInfo");

  return !token || !refreshToken || !refreshTokenExpiryTime || !userInfo ? null : { token, refreshToken, refreshTokenExpiryTime: new Date(refreshTokenExpiryTime), userInfo };
}

export const AuthContext = createContext<{
    auth: {
        token: string,
        refreshToken: string,
        refreshTokenExpiryTime: Date,
        userInfo: string,
    } | null;
    onLogin: (email: string, pass: string) => Promise<void>;
    onLogout: () => void;
}>({
    auth: getAuthInfo(),
    onLogin: async () => { },
    onLogout: () => { },
});

export const useAuth = () => {
    return useContext(AuthContext);
};