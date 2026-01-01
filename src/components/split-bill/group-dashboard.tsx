"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { Member, Expense } from "@/lib/types";
import { calculateSettlements } from "@/lib/logic";
import MembersList from "@/components/split-bill/members-list";
import ExpenseList from "@/components/split-bill/expense-list";
import AddExpenseDialog from "@/components/split-bill/add-expense-dialog";
import SettlementSummary from "@/components/split-bill/settlement-summary";
import { Button } from "@/components/ui/button";
import { Share2, RotateCw } from "lucide-react";
import { addMember, deleteMember, addExpense, deleteExpense } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface GroupDashboardProps {
    groupId: string;
    groupName: string;
    initialMembers: Member[];
    initialExpenses: Expense[];
}

export default function GroupDashboard({
    groupId,
    groupName,
    initialMembers,
    initialExpenses,
}: GroupDashboardProps) {
    const router = useRouter();

    // Use local state for immediate feedback/optimistic updates
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

    useEffect(() => {
        setMembers(initialMembers);
        setExpenses(initialExpenses);
    }, [initialMembers, initialExpenses]);

    // Derived state
    const settlements = useMemo(() => calculateSettlements(members, expenses), [members, expenses]);

    // ... handlers ...

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md px-4 py-3 shadow-sm">
                <div className="mx-auto flex max-w-2xl items-center justify-between">
                    <Link href="/" className="hover:opacity-70 transition-opacity flex flex-col">
                        <h1 className="text-lg font-semibold text-slate-800 leading-tight">Osamari</h1>
                        <span className="text-xs text-slate-500 font-medium truncate max-w-[150px] sm:max-w-xs">{groupName}</span>
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleRefresh} className="gap-2">
                            <RotateCw size={16} />
                            <span className="hidden sm:inline">更新</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={copyLink} className="gap-2">
                            <Share2 size={16} />
                            <span className="hidden sm:inline">共有</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-2xl p-4 space-y-6">
                {/* Members Section */}
                <section className="space-y-3">
                    <h2 className="text-lg font-medium text-slate-700">メンバー ({members.length})</h2>
                    <MembersList members={members} onAdd={handleAddMember} onRemove={handleRemoveMember} />
                </section>

                {/* Settlement Section */}
                {members.length > 1 && expenses.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-lg font-medium text-slate-700">精算プラン (最短ルート)</h2>
                        <SettlementSummary settlements={settlements} members={members} />
                    </section>
                )}

                {/* Expenses Section */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-slate-700">支払い履歴</h2>
                        <AddExpenseDialog members={members} onAdd={handleAddExpense} />
                    </div>
                    <ExpenseList expenses={expenses} members={members} onRemove={handleRemoveExpense} />
                </section>
            </main>
        </div>
    );
}
