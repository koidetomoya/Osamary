import { useLiff } from "@/lib/liff-provider";
import { useEffect, useState } from "react";
import { getUserGroups, deleteUserGroup } from "@/app/actions";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Clock, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LineLoginButton from "@/components/line-login-button";

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

    const handleDelete = async (e: React.MouseEvent, groupId: string, groupName: string) => {
        e.preventDefault(); // Prevent Link navigation
        if (!confirm(`「${groupName}」の履歴を削除しますか？\n※グループ自体は削除されません`)) return;

        if (!profile?.userId) return;

        // Optimistic update
        const previousGroups = [...groups];
        setGroups((prev) => prev.filter((g) => g.groupId !== groupId));

        try {
            await deleteUserGroup(profile.userId, groupId);
            toast.success("履歴から削除しました");
        } catch (error) {
            console.error("Failed to delete group history", error);
            toast.error("削除に失敗しました");
            setGroups(previousGroups);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="w-full max-w-md pt-8 text-center space-y-2 opacity-80">
                <p className="text-xs text-muted-foreground">
                    LINEでログインすると<br />
                    アクセスしたグループがここに履歴として残ります
                </p>
                <div className="pt-2">
                    <LineLoginButton />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-3 pt-4">
            <h2 className="text-sm font-bold text-muted-foreground text-left px-1">最近のグループ</h2>
            {loading ? (
                <div className="text-center text-xs text-muted-foreground py-2">読み込み中...</div>
            ) : groups.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground py-2">
                    履歴はありません
                </div>
            ) : (
                <div className="space-y-4">
                    {groups.map((group) => (
                        <Link href={`/group/${group.groupId}`} key={group.groupId}>
                            <div className="flex items-center justify-between p-3 bg-card rounded-xl shadow-sm border border-border hover:bg-muted transition-colors cursor-pointer group">
                                <div>
                                    <h3 className="font-medium text-foreground text-sm">
                                        {group.groupName || "名称未設定"}
                                    </h3>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                                        <Clock size={10} />
                                        <span>
                                            {new Date(group.joinedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        onClick={(e) => handleDelete(e, group.groupId, group.groupName)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                    <ChevronRight size={14} className="text-muted-foreground" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
