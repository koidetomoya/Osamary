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
import { addMember, deleteMember, addExpense, deleteExpense, updateExpense } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGroupHistory } from "@/hooks/use-group-history";


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
    const { saveGroup } = useGroupHistory();

    // Use local state for immediate feedback/optimistic updates
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

    useEffect(() => {
        setMembers(initialMembers);
        setExpenses(initialExpenses);
    }, [initialMembers, initialExpenses]);

    // Save group to local history on mount/update
    useEffect(() => {
        if (groupId && groupName) {
            saveGroup(groupId, groupName);
        }
    }, [groupId, groupName, saveGroup]);

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
            title: `Osamary - ${groupName}`,
            text: `${groupName || "新しいグループ"}の割り勘へ参加をお願いします！｜Osamary`,
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
        <div className="min-h-screen bg-background pb-20 md:pb-8">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md px-4 py-3 shadow-sm border-border">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <Link href="/" className="hover:opacity-70 transition-opacity">
                        <h1 className="text-lg font-semibold text-foreground">Osamary</h1>
                    </Link>
                    <div className="flex gap-2 items-center">
                        {/* Header Actions if any */}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl p-4">
                {/* Group Name */}
                {groupName && (
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-foreground truncate">{groupName}</h1>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={handleRefresh} className="text-muted-foreground hover:text-foreground" title="更新">
                                <RotateCw size={20} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleShare} className="text-primary hover:text-primary/90 hover:bg-primary/5" title="共有">
                                <Share2 size={20} />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Left Column (Info & Summary) */}
                    <div className="md:col-span-4 space-y-6 md:sticky md:top-24">
                        {/* Settlement Section (Moved up for priority on desktop context if desired, or keep order) */}
                        {/* Actually, let's keep members first as context provider */}

                        {/* Members Section */}
                        <section className="space-y-3 bg-card p-4 rounded-2xl shadow-sm border border-border">
                            <h2 className="text-lg font-medium text-card-foreground">メンバー ({members.length})</h2>
                            <MembersList members={members} onAdd={handleAddMember} onRemove={handleRemoveMember} />
                        </section>

                        {/* Settlement Section */}
                        {members.length > 1 && expenses.length > 0 && (
                            <section className="space-y-3 bg-card p-4 rounded-2xl shadow-sm border border-border">
                                <h2 className="text-lg font-medium text-card-foreground">精算プラン</h2>
                                <SettlementSummary settlements={settlements} members={members} />
                            </section>
                        )}
                    </div>

                    {/* Right Column (Expenses) */}
                    <div className="md:col-span-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-card-foreground">支払い履歴</h2>
                            {/* Desktop Add Button - Placed here */}
                            <div className="hidden md:block">
                                <ExpenseFormDialog members={members} onSubmit={handleAddExpense} />
                            </div>
                        </div>

                        {expenses.length === 0 ? (
                            <div className="text-center py-10 bg-muted/50 rounded-2xl border border-dashed border-border">
                                <p className="text-muted-foreground text-sm">まだ支払いがありません</p>
                            </div>
                        ) : (
                            <div className="">
                                <ExpenseList expenses={expenses} members={members} onRemove={handleRemoveExpense} onUpdate={handleUpdateExpense} />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile FAB */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <ExpenseFormDialog
                    members={members}
                    onSubmit={handleAddExpense}
                    triggerButton={
                        <Button
                            size="icon"
                            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
                        >
                            <span className="sr-only">支払いを追加</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                        </Button>
                    }
                />
            </div>
        </div>
    );
}
