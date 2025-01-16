"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Liff } from "@line/liff";

type LiffContextType = {
  liff: Liff | null;
  liffError: string | null;
  userId: string | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const LiffContext = createContext<LiffContextType>({
  liff: null,
  liffError: null,
  userId: null,
  isLoggedIn: false,
  login: () => { },
  logout: () => { },
});

export const LiffProvider = ({ children }: { children: ReactNode }) => {
  const [liff, setLiff] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...");
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
          .then(() => {
            console.log("LIFF init succeeded.");
            setLiff(liff);
            if (liff.isLoggedIn()) {
              setIsLoggedIn(true);
              fetchUserId(liff);
            }
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.");
            setLiffError(error.toString());
          });
      });
  }, []);

  const fetchUserId = async (liff: Liff) => {
    try {
      const profile = await liff.getProfile();
      setUserId(profile.userId);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const login = () => {
    if (liff) {
      liff.login();
    }
  };

  const logout = () => {
    if (liff) {
      liff.logout();
      setUserId(null);
      setIsLoggedIn(false);
    }
  };

  return (
    <LiffContext.Provider value={{ liff, liffError, userId, isLoggedIn, login, logout }}>
      {children}
    </LiffContext.Provider>
  );
};

export const useLiff = () => useContext(LiffContext);

