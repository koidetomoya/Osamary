import { useLiff } from "@/lib/liff-provider";
import { Button } from "./ui/button";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LineLoginButton() {
    const { isLoggedIn, login, logout, profile, error } = useLiff();

    // Loading state or initial state handled by provider logic usually,
    // but if profile is null and isLoggedIn is true, it might be loading.
    // However, useLiff handles this well.

    if (isLoggedIn && profile) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">
                            {profile.displayName}
                        </span>
                        {profile.pictureUrl ? (
                            <img
                                src={profile.pictureUrl}
                                alt={profile.displayName}
                                className="h-8 w-8 rounded-full border border-slate-200"
                            />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300" />
                        )}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>アカウント</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            if (confirm("ログアウトしますか？")) {
                                logout();
                            }
                        }}
                        className="text-red-500 focus:text-red-500 focus:bg-red-50"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>ログアウト</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
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
