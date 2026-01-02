"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import liff from "@line/liff";

interface LiffProfile {
    userId: string;
    displayName: string;
    pictureUrl?: string;
}

interface LiffContextType {
    liff: typeof liff | null;
    isLoggedIn: boolean;
    profile: LiffProfile | null;
    error: string | null;
    login: () => void;
    logout: () => void;
}

const LiffContext = createContext<LiffContextType>({
    liff: null,
    isLoggedIn: false,
    profile: null,
    error: null,
    login: () => { },
    logout: () => { },
});

export const useLiff = () => useContext(LiffContext);

export const LiffProvider = ({ children }: { children: React.ReactNode }) => {
    const [liffObject, setLiffObject] = useState<typeof liff | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState<LiffProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Avoid initializing on server-side
        if (typeof window === "undefined") return;

        const initLiff = async () => {
            try {
                const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID;
                if (!liffId) {
                    console.warn("LIFF ID is not provided.");
                    return;
                }

                await liff.init({ liffId });
                setLiffObject(liff);

                if (liff.isLoggedIn()) {
                    setIsLoggedIn(true);
                    const userProfile = await liff.getProfile();
                    setProfile({
                        userId: userProfile.userId,
                        displayName: userProfile.displayName,
                        pictureUrl: userProfile.pictureUrl,
                    });

                    // Clean up URL parameters (code, state, etc.)
                    const url = new URL(window.location.href);
                    if (url.searchParams.has("code") || url.searchParams.has("state") || url.searchParams.has("liffClientId")) {
                        url.searchParams.delete("code");
                        url.searchParams.delete("state");
                        url.searchParams.delete("liffClientId");
                        url.searchParams.delete("liffRedirectUri");
                        window.history.replaceState({}, "", url.toString());
                    }
                }
            } catch (e: any) {
                console.error("LIFF initialization failed", e);
                setError(e.toString());
            }
        };

        initLiff();
    }, []);

    const login = () => {
        if (!liffObject) return;
        if (!liffObject.isLoggedIn()) {
            liffObject.login({ redirectUri: window.location.href });
        }
    };

    const logout = () => {
        if (!liffObject) return;
        if (liffObject.isLoggedIn()) {
            liffObject.logout();
            setIsLoggedIn(false);
            setProfile(null);
            window.location.reload();
        }
    };

    return (
        <LiffContext.Provider value={{ liff: liffObject, isLoggedIn, profile, error, login, logout }}>
            {children}
        </LiffContext.Provider>
    );
};
