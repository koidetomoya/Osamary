import { Expense, Member } from "@/lib/types";
import { formatCurrency } from "@/lib/logic";
import { Trash2, Receipt, Edit2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

import ExpenseFormDialog from "./add-expense-dialog";

interface ExpenseListProps {
    expenses: Expense[];
    members: Member[];
    onRemove: (id: string) => void;
    onUpdate: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, members, onRemove, onUpdate }: ExpenseListProps) {
    const getMemberName = (id: string) => members.find((m) => m.id === id)?.name || "不明";

    const getCurrencySymbol = (code: string) => {
        const currencies: Record<string, string> = {
            JPY: "¥", USD: "$", EUR: "€", KRW: "₩", CNY: "¥",
            TWD: "NT$", GBP: "£", AUD: "A$", THB: "฿", VND: "₫"
        };
        return currencies[code] || code;
    };

    if (expenses.length === 0) {
        return (
            <Card className="flex h-40 flex-col items-center justify-center border-dashed bg-muted/30 text-muted-foreground">
                <div className="bg-background p-3 rounded-full mb-3 ring-1 ring-border shadow-sm">
                    <Receipt className="h-6 w-6 opacity-70" />
                </div>
                <p className="text-sm font-medium">まだ支払いがありません</p>
                <p className="text-xs opacity-70 mt-1">「支払いを追加」から記録しましょう</p>
            </Card>
        );
    }

    return (
        <div className="space-y-2">
            <AnimatePresence initial={false} mode="popLayout">
                {expenses.map((expense) => (
                    <motion.div
                        key={expense.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3 }}
                        className="group flex items-center justify-between rounded-xl bg-card p-4 shadow-sm ring-1 ring-border transition-all hover:bg-muted/50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <span className="text-xs font-bold">{getMemberName(expense.payerId).slice(0, 2)}</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">

                                    <p className="text-sm font-medium text-foreground">
                                        {expense.note || "無題の支払い"}
                                    </p>
                                </div>
                                <div className="flex flex-col text-xs text-muted-foreground">
                                    <span>
                                        <span className="font-medium text-foreground">
                                            {getMemberName(expense.payerId)}
                                        </span>{" "}
                                        が支払い
                                    </span>
                                    <span>
                                        対象:{" "}
                                        {expense.involvedMemberIds &&
                                            expense.involvedMemberIds.length > 0 &&
                                            expense.involvedMemberIds.length < members.length
                                            ? expense.involvedMemberIds
                                                .map((id) => getMemberName(id))
                                                .join(", ")
                                            : "全員"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="text-right mr-2">
                                {expense.currencyCode && expense.currencyCode !== 'JPY' && expense.foreignAmount ? (
                                    <>
                                        <div className="font-mono text-lg font-bold text-foreground leading-none">
                                            {getCurrencySymbol(expense.currencyCode)}{expense.foreignAmount.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-mono">
                                            {formatCurrency(expense.amount)}
                                        </div>
                                    </>
                                ) : (
                                    <span className="font-mono text-lg font-bold text-foreground">
                                        {formatCurrency(expense.amount)}
                                    </span>
                                )}
                            </div>

                            <ExpenseFormDialog
                                members={members}
                                onSubmit={onUpdate}
                                initialData={expense}
                                triggerButton={
                                    <button
                                        className="rounded-full p-2 text-muted-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
                                        aria-label="編集"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                }
                            />

                            <button
                                onClick={() => onRemove(expense.id)}
                                className="rounded-full p-2 text-muted-foreground/70 hover:bg-red-50 hover:text-red-500 transition-colors"
                                aria-label="削除"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
