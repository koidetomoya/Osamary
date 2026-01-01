"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Member, Expense } from "@/lib/types";
import { calculateSettlements } from "@/lib/logic";
import MembersList from "@/components/split-bill/members-list";
import ExpenseList from "@/components/split-bill/expense-list";
import AddExpenseDialog from "@/components/split-bill/add-expense-dialog";
import SettlementSummary from "@/components/split-bill/settlement-summary";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";

export default function GroupPage() {
    const params = useParams();
    const groupId = params.groupId as string;

    // Local state for now
    const [members, setMembers] = useState<Member[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    // Derived state
    const settlements = useMemo(() => calculateSettlements(members, expenses), [members, expenses]);

    const addMember = (name: string) => {
        setMembers([...members, { id: crypto.randomUUID(), name }]);
    };

    const removeMember = (id: string) => {
        // Check if member has transactions? For now just remove.
        // In real app, might want to block if expenses exist.
        setMembers(members.filter((m) => m.id !== id));
    };

    const addExpense = (expense: Expense) => {
        setExpenses([...expenses, expense]);
    };

    const removeExpense = (id: string) => {
        setExpenses(expenses.filter((e) => e.id !== id));
    };

    const copyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        // Could add toast here
        alert("リンクをコピーしました");
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md px-4 py-3 shadow-sm">
                <div className="mx-auto flex max-w-2xl items-center justify-between">
                    <h1 className="text-lg font-semibold text-slate-800">Split Bill</h1>
                    <Button variant="outline" size="sm" onClick={copyLink} className="gap-2">
                        <Share2 size={16} />
                        <span className="hidden sm:inline">共有</span>
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-2xl p-4 space-y-6">
                {/* Members Section */}
                <section className="space-y-3">
                    <h2 className="text-lg font-medium text-slate-700">メンバー ({members.length})</h2>
                    <MembersList members={members} onAdd={addMember} onRemove={removeMember} />
                </section>

                {/* Expenses Section */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-slate-700">支払い履歴</h2>
                        <AddExpenseDialog members={members} onAdd={addExpense} />
                    </div>
                    <ExpenseList expenses={expenses} members={members} onRemove={removeExpense} />
                </section>

                {/* Settlement Section */}
                {members.length > 1 && expenses.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-lg font-medium text-slate-700">精算プラン (最短ルート)</h2>
                        <SettlementSummary settlements={settlements} members={members} />
                    </section>
                )}
            </main>
        </div>
    );
}
