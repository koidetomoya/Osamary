"use client";

import { useLiff } from "@/lib/liff-provider";
import { useEffect, useState } from "react";
import { getUserGroups } from "@/app/actions";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Clock, ChevronRight } from "lucide-react";

interface UserGroup {
    groupId: string;
    groupName: string;
    joinedAt: string;
}

export default function MyGroups() {
    const { isLoggedIn, profile } = useLiff();
    const [groups, setGroups] = useState<UserGroup[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoggedIn && profile?.userId) {
            setLoading(true);
            getUserGroups(profile.userId)
                .then(setGroups)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [isLoggedIn, profile]);

    if (!isLoggedIn) {
        return (
            <div className="w-full max-w-md pt-8 text-center space-y-2 opacity-80">
                <p className="text-xs text-slate-500">
                    LINEでログインすると<br />
                    アクセスしたグループがここに履歴として残ります
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-3 pt-4">
            <h2 className="text-sm font-bold text-slate-500 text-left px-1">最近のグループ</h2>
            {loading ? (
                <div className="text-center text-xs text-slate-400 py-2">読み込み中...</div>
            ) : groups.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-2">
                    履歴はありません
                </div>
            ) : (
                <div className="space-y-2">
                    {groups.map((group) => (
                        <Link href={`/group/${group.groupId}`} key={group.groupId}>
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                                <div>
                                    <h3 className="font-medium text-slate-900 text-sm">
                                        {group.groupName || "名称未設定"}
                                    </h3>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                                        <Clock size={10} />
                                        <span>
                                            {new Date(group.joinedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-slate-300" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
