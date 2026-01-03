"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
                <AnimatePresence mode="popLayout">
                    {members.map((member) => (
                        <motion.div
                            key={member.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            layout
                            className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 shadow-sm ring-1 ring-border"
                        >
                            <User size={14} className="text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{member.name}</span>
                            <button
                                onClick={() => onRemove(member.id)}
                                className="ml-1 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {members.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground w-full border border-dashed border-border rounded-xl bg-muted/30">
                        <div className="bg-background p-2 rounded-full mb-2 ring-1 ring-border shadow-sm">
                            <UserPlus className="h-5 w-5 opacity-70" />
                        </div>
                        <span className="text-sm font-medium">メンバーを追加してください</span>
                        <span className="text-xs opacity-70 mt-0.5">まずは自分や友達の名前を入力</span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="名前を入力..."
                    className="h-10 bg-card"
                />
                <Button type="submit" disabled={!newName.trim()} size="icon" className="h-10 w-10 shrink-0">
                    <UserPlus size={18} />
                </Button>
            </form>
        </div>
    );
}
