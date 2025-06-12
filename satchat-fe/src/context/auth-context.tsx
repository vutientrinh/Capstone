"use client";

import backendClient from "@/utils/BackendClient";
import UserContext from "@/context/UserContext";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
// import { SocketClientProvider } from "./socket-context";

interface AuthContextType {
  isAuthenticated: boolean | null;
  isLoading: boolean | null;
  username: string | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setAuthFromOAuth: (credentials: { token: string; username: string }) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setAuth] = useState<boolean | null>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(
    getCookie("token") || (null as any)
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [context, setContext] = useState({});

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const jsonPayload = await backendClient.login({
      username,
      password,
    });

    if (!jsonPayload?.data) {
      return;
    }

    const {
      id,
      token,
      refreshToken,
      username: reponseUserName,
    } = jsonPayload.data;
    setToken(token);
    setAuth(true);
    setUsername(reponseUserName);

    // set cookies
    setCookie("token", token);
    setCookie("refreshToken", refreshToken);
    setCookie("username", reponseUserName);

    // set backendClient token
    backendClient.jwt = token;

    // set user context
    setContext({ id, username: reponseUserName, token });

    // direct to dashboard
    router.push("/");
  };

  const logout = async () => {
    // direct to login
    router.push("/login");
    await backendClient.logout();

    // delete cookies
    deleteCookie("token");
    deleteCookie("refreshToken");
    deleteCookie("username");

    // set backendClient token
    backendClient.jwt = "" as string;
    setToken(null);
    setAuth(false);
    setUsername(null);
  };

  const refreshToken = async () => {
    const jsonPayload = await backendClient.refreshToken();
    if (!jsonPayload?.data) {
      return;
    }

    const { accessToken, refreshToken } = jsonPayload.data;
    setToken(accessToken);

    // set token cookie
    setCookie("token", accessToken);
    setCookie("refreshToken", refreshToken);

    // set backendClient token
    backendClient.jwt = accessToken as any;
  };

  const introspect = async () => {
    // call introspect API
    const jsonPayload = await backendClient.introspect();
    const { valid } = jsonPayload?.data;

    // if token is expired
    if (!valid && isSaved) {
      await refreshToken();
    }

    return valid;
  };

  const setAuthFromOAuth = ({
    token,
    username,
  }: {
    token: string;
    username: string;
  }) => {
    setToken(token);
    setAuth(true);
    setUsername(username);
    backendClient.jwt = token;
    setContext({ username, token });
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = getCookie("token");

      if (!token) {
        setAuth(false);
        setIsLoading(false);
        return;
      }

      const valid = await introspect();
      setAuth(valid);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        username,
        login,
        logout,
        setAuthFromOAuth,
      }}
    >
      <UserContext.Provider value={context}>{children}</UserContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
