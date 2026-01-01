"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { Member, Expense } from "@/lib/types";
import { calculateSettlements } from "@/lib/logic";
import MembersList from "@/components/split-bill/members-list";
import ExpenseList from "@/components/split-bill/expense-list";
import ExpenseFormDialog from "@/components/split-bill/add-expense-dialog";
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

    const handleAddMember = async (name: string) => {
        const newMember = { id: crypto.randomUUID(), name };
        // Optimistic update
        setMembers((prev) => [...prev, newMember]);

        try {
            await addMember(groupId, newMember);
            toast.success(`${name} を追加しました`);
            router.refresh();
        } catch (error) {
            console.error("Failed to add member", error);
            toast.error("メンバーの追加に失敗しました");
            // Revert on error
            setMembers((prev) => prev.filter((m) => m.id !== newMember.id));
        }
    };

    const handleRemoveMember = async (id: string) => {
        const memberToRemove = members.find((m) => m.id === id);
        if (!memberToRemove || !confirm(`${memberToRemove.name} を削除しますか？\n※このメンバーに関連する支払い計算に影響が出る可能性があります。`)) return;

        const previousMembers = [...members];

        setMembers((prev) => prev.filter((m) => m.id !== id));

        try {
            await deleteMember(groupId, id);
            toast.success("メンバーを削除しました");
            router.refresh();
        } catch (error) {
            console.error("Failed to delete member", error);
            toast.error("削除に失敗しました");
            setMembers(previousMembers);
        }
    };

    const handleAddExpense = async (expense: Expense) => {
        setExpenses((prev) => [...prev, expense]);
        try {
            await addExpense(groupId, expense);
            toast.success("支払いを追加しました");
            router.refresh();
        } catch (error) {
            console.error("Failed to add expense", error);
            toast.error("支払いの追加に失敗しました");
            setExpenses((prev) => prev.filter((e) => e.id !== expense.id));
        }
    };

    const handleRemoveExpense = async (id: string) => {
        if (!confirm("この支払いを削除しますか？")) return;

        const previousExpenses = [...expenses];
        setExpenses((prev) => prev.filter((e) => e.id !== id));

        try {
            await deleteExpense(groupId, id);
            toast.success("支払いを削除しました");
            router.refresh();
        } catch (error) {
            console.error("Failed to delete expense", error);
            toast.error("削除に失敗しました");
            setExpenses(previousExpenses);
        }
    };

    const handleUpdateExpense = async (updatedExpense: Expense) => {
        const previousExpenses = [...expenses];
        setExpenses((prev) => prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e)));

        try {
            await addExpense(groupId, updatedExpense); // addExpense serves as upsert
            toast.success("支払いを更新しました");
            router.refresh();
        } catch (error) {
            console.error("Failed to update expense", error);
            toast.error("更新に失敗しました");
            setExpenses(previousExpenses);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        const shareData = {
            title: `Osamari - ${groupName}`,
            text: `${groupName || "新しいグループ"}の割り勘へ参加をお願いします！｜Osamari`,
            url: url,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // User cancelled or share failed, fallback handled implicitly or ignored if just cancellation
                if ((err as Error).name !== "AbortError") {
                    console.error("Share failed", err);
                }
            }
        } else {
            // Fallback for desktop/unsupported browsers
            navigator.clipboard.writeText(url);
            toast.success("リンクをコピーしました");
        }
    };

    const handleRefresh = () => {
        router.refresh();
        toast.success("最新情報を取得しました");
    };

    // Revalidate on visibility change (focus)
    useEffect(() => {
        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                router.refresh();
            }
        };
        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => document.removeEventListener("visibilitychange", onVisibilityChange);
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md px-4 py-3 shadow-sm">
                <div className="mx-auto flex max-w-2xl items-center justify-between">
                    <Link href="/" className="hover:opacity-70 transition-opacity">
                        <h1 className="text-lg font-semibold text-slate-800">Osamari</h1>
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleRefresh} className="gap-2">
                            <RotateCw size={16} />
                            <span className="hidden sm:inline">更新</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                            <Share2 size={16} />
                            <span className="hidden sm:inline">共有</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-2xl p-4 space-y-6">
                {/* Group Name */}
                {groupName && (
                    <div className="mb-2">
                        <h1 className="text-2xl font-bold text-slate-900">{groupName}</h1>
                    </div>
                )}

                {/* Members Section */}
                <section className="space-y-3">
                    <h2 className="text-lg font-medium text-slate-700">メンバー ({members.length})</h2>
                    <MembersList members={members} onAdd={handleAddMember} onRemove={handleRemoveMember} />
                </section>

                {/* Expenses Section */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-slate-700">支払い履歴</h2>
                        <ExpenseFormDialog members={members} onSubmit={handleAddExpense} />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto pr-1">
                        <ExpenseList expenses={expenses} members={members} onRemove={handleRemoveExpense} onUpdate={handleUpdateExpense} />
                    </div>
                </section>

                {/* Settlement Section */}
                {members.length > 1 && expenses.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-lg font-medium text-slate-700">精算プラン</h2>
                        <SettlementSummary settlements={settlements} members={members} />
                    </section>
                )}
            </main>
        </div>
    );
}
