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

    if (!isLoggedIn) return null;

    return (
        <div className="w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-slate-800 text-left">最近のグループ</h2>
            {loading ? (
                <div className="text-center text-sm text-slate-500 py-4">読み込み中...</div>
            ) : groups.length === 0 ? (
                <div className="text-center text-sm text-slate-500 py-4">
                    履歴はありません
                </div>
            ) : (
                <div className="space-y-2">
                    {groups.map((group) => (
                        <Link href={`/group/${group.groupId}`} key={group.groupId}>
                            <Card className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                                <div>
                                    <h3 className="font-medium text-slate-900">
                                        {group.groupName || "名称未設定"}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Clock size={12} />
                                        <span>
                                            {new Date(group.joinedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-300" />
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
