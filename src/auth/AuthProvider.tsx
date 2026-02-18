import { useCallback, useEffect, useState } from "react";
import { useNavigate} from "react-router";
import axios, { type AxiosResponse } from "axios";
import type {  SingInResponse } from "../models/api-models";
import { AuthContext, getAuthInfo } from "../state-context/auth-context";
// import { routes } from "../App";


type AuthProviderProps = {
    children: React.ReactNode;
};
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(getAuthInfo());

    // 1. Define Logout as a stable function
    const onLogout = useCallback(() => {
        setToken(null);
        localStorage.clear(); // Clears everything including tokens and expTime
        navigate('/');
    }, [navigate]);

    // 2. Token Refresh/Expiry Logic inside useEffect
   // AuthProvider.tsx inside the component
useEffect(() => {
    const checkToken = async () => {
        const authInfo = getAuthInfo();
        
        // If no info found in storage but state 'auth' still exists, clear it
        if (!authInfo) {
            if (token) setToken(null); 
            return;
        }

        const currentTime = new Date();
        const expiryTime = new Date(authInfo.refreshTokenExpiryTime);
        const remainingTime = (expiryTime.getTime() - currentTime.getTime()) / 1000;

        // 1. SESSION EXPIRED
        if (remainingTime <= 0) {
            console.log("Token expired, logging out...");
            onLogout(); // This sets token to null and clears storage
            return;
        }

        // 2. REFRESH NEEDED
        if (remainingTime < 60) {
            try {
                const response = await axios.post(
                    "https://bssrms.runasp.net/api/Auth/refreshToken",
                    { refreshToken: authInfo.refreshToken }
                );
                
                const updatedInfo = {
                    ...authInfo,
                    token: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    refreshTokenExpiryTime: new Date(response.data.refreshTokenExpiryTime)
                };

                localStorage.setItem("token", updatedInfo.token);
                localStorage.setItem("refreshToken", updatedInfo.refreshToken);
                localStorage.setItem("expTime", response.data.refreshTokenExpiryTime);
                
                setToken(updatedInfo); // Refresh state to keep user in
            } catch (err) {
                onLogout(); // If refresh fails, kick them out
            }
        }
    };

    // Run check immediately on mount
    checkToken();

    // Then check every 5 seconds (more frequent for faster response)
    const interval = setInterval(checkToken, 5000);

    return () => clearInterval(interval);
}, [onLogout, token]); // Re-run if token state changes
    const value = {
        auth: token,
        onLogin: async (email: string, pass: string) => {
            const response: AxiosResponse<SingInResponse> = await axios.post(
                'https://bssrms.runasp.net/api/Auth/signIn',
                { userName: email, password: pass },
            );

            const data = response.data;
            if (data) {
                const userInfo = {
                    name: data.user.userName || '[empty]',
                    email: email,
                };
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('expTime', data.refreshTokenExpiryTime);
                localStorage.setItem('userInfo', JSON.stringify(userInfo));

                setToken({
                    token: data.token,
                    refreshToken: data.refreshToken,
                    refreshTokenExpiryTime: new Date(data.refreshTokenExpiryTime),
                    userInfo: JSON.stringify(userInfo)
                });
            } else {
                throw new Error('Login failed');
            }
        },
        onLogout: onLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};