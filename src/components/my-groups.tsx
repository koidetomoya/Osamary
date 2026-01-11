import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useGroupHistory, GroupHistoryItem } from "@/hooks/use-group-history";

export default function MyGroups() {
    const { history, isLoaded, removeGroup } = useGroupHistory();
    const [groups, setGroups] = useState<GroupHistoryItem[]>([]);

    useEffect(() => {
        setGroups(history);
    }, [history]);

    const handleDelete = (e: React.MouseEvent, groupId: string, groupName: string) => {
        e.preventDefault(); // Prevent Link navigation
        if (!confirm(`「${groupName}」の履歴を削除しますか？\n※グループ自体は削除されません`)) return;

        removeGroup(groupId);
        toast.success("履歴から削除しました");
    };

    if (!isLoaded) {
        return <div className="text-center text-xs text-muted-foreground py-2">読み込み中...</div>;
    }

    return (
        <div className="w-full max-w-md space-y-3 pt-4">
            <h2 className="text-sm font-bold text-muted-foreground text-left px-1">最近のグループ</h2>
            {groups.length === 0 ? (
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
                                            {new Date(group.lastVisited).toLocaleDateString()}
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
