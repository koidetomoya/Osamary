import { useState } from "react";
import { Member } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, UserPlus, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MembersListProps {
    members: Member[];
    onAdd: (name: string) => void;
    onRemove: (id: string) => void;
}

export default function MembersList({ members, onAdd, onRemove }: MembersListProps) {
    const [newName, setNewName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            onAdd(newName.trim());
            setNewName("");
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200"
                    >
                        <User size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{member.name}</span>
                        <button
                            onClick={() => onRemove(member.id)}
                            className="ml-1 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
                {members.length === 0 && (
                    <p className="text-sm text-slate-400 py-1.5 px-2">メンバーを追加してください</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="名前を入力..."
                    className="h-10 bg-white"
                />
                <Button type="submit" disabled={!newName.trim()} size="icon" className="h-10 w-10 shrink-0">
                    <UserPlus size={18} />
                </Button>
            </form>
        </div>
    );
}
