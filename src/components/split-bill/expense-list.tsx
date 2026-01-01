import { Expense, Member } from "@/lib/types";
import { formatCurrency } from "@/lib/logic";
import { Trash2, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ExpenseListProps {
    expenses: Expense[];
    members: Member[];
    onRemove: (id: string) => void;
}

import ExpenseFormDialog from "./add-expense-dialog";
import { Edit2 } from "lucide-react";

interface ExpenseListProps {
    expenses: Expense[];
    members: Member[];
    onRemove: (id: string) => void;
    onUpdate: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, members, onRemove, onUpdate }: ExpenseListProps) {
    const getMemberName = (id: string) => members.find((m) => m.id === id)?.name || "不明";

    if (expenses.length === 0) {
        return (
            <Card className="flex h-32 flex-col items-center justify-center border-dashed bg-slate-50 text-slate-400">
                <Receipt className="mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">まだ支払いがありません</p>
            </Card>
        );
    }

    return (
        <div className="space-y-2">
            {expenses.map((expense) => (
                <div
                    key={expense.id}
                    className="group flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all hover:bg-slate-50"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <span className="text-xs font-bold">{getMemberName(expense.payerId).slice(0, 2)}</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">
                                {expense.note || "無題の支払い"}
                            </p>
                            <div className="flex flex-col text-xs text-slate-500">
                                <span>
                                    <span className="font-medium text-slate-700">
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
                        <span className="font-mono text-lg font-bold text-slate-900 mr-2">
                            {formatCurrency(expense.amount)}
                        </span>

                        <ExpenseFormDialog
                            members={members}
                            onSubmit={onUpdate}
                            initialData={expense}
                            triggerButton={
                                <button
                                    className="rounded-full p-2 text-slate-300 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                                    aria-label="編集"
                                >
                                    <Edit2 size={16} />
                                </button>
                            }
                        />

                        <button
                            onClick={() => onRemove(expense.id)}
                            className="rounded-full p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                            aria-label="削除"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
