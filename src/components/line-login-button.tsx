"use client";

import { useLiff } from "@/lib/liff-provider";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";

export default function LineLoginButton() {
    const { isLoggedIn, login, logout, profile } = useLiff();

    if (isLoggedIn && profile) {
        return (
            <div className="flex items-center gap-2">
                {profile.pictureUrl && (
                    <img
                        src={profile.pictureUrl}
                        alt={profile.displayName}
                        className="h-8 w-8 rounded-full"
                    />
                )}
                <span className="text-sm font-medium text-slate-700">
                    {profile.displayName}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        if (confirm("ログアウトしますか？")) {
                            logout();
                        }
                    }}
                    className="text-slate-500 hover:text-red-500"
                >
                    <LogOut size={16} />
                </Button>
            </div>
        );
    }

    return (
        <Button
            onClick={login}
            className="bg-[#06C755] hover:bg-[#05b34c] text-white"
            size="sm"
        >
            <LogIn className="mr-2 h-4 w-4" />
            LINEでログイン
        </Button>
    );
}
