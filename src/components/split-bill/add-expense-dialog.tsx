import { useState, useEffect } from "react";
import { Member, Expense } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface ExpenseFormDialogProps {
    members: Member[];
    onSubmit: (expense: Expense) => void;
    initialData?: Expense;
    triggerButton?: React.ReactNode;
}

export default function ExpenseFormDialog({ members, onSubmit, initialData, triggerButton }: ExpenseFormDialogProps) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(initialData?.amount.toString() || "");
    const [note, setNote] = useState(initialData?.note || "");
    const [payerId, setPayerId] = useState(initialData?.payerId || "");
    const [involvedMemberIds, setInvolvedMemberIds] = useState<string[]>(initialData?.involvedMemberIds || []);

    // Initialize/Reset when dialog opens or initialData changes
    useEffect(() => {
        if (open) {
            setAmount(initialData?.amount.toString() || "");
            setNote(initialData?.note || "");
            setPayerId(initialData?.payerId || "");
            // If editing, use existing involved members. If creating, default to all.
            setInvolvedMemberIds(initialData?.involvedMemberIds || members.map((m) => m.id));
        }
    }, [open, initialData, members]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !payerId || involvedMemberIds.length === 0) return;

        onSubmit({
            id: initialData?.id || crypto.randomUUID(),
            amount: parseInt(amount),
            note: note,
            payerId: payerId,
            involvedMemberIds: involvedMemberIds,
            date: initialData?.date || new Date().toISOString(),
        });

        setOpen(false);
        if (!initialData) {
            setAmount("");
            setNote("");
        }
        // Keep payerId
    };

    const toggleMember = (memberId: string) => {
        setInvolvedMemberIds((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const isFormValid =
        amount && payerId && parseInt(amount) > 0 && involvedMemberIds.length > 0;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || (
                    <Button
                        size="sm"
                        className="gap-1 rounded-full px-4"
                        disabled={members.length === 0}
                    >
                        <Plus size={16} />
                        支払いを追加
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "支払いを編集" : "支払いを記録する"}</DialogTitle>
                    <DialogDescription>
                        金額と支払った人、割り勘の対象者を入力してください。
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Payer */}
                    <div className="space-y-2">
                        <Label htmlFor="payer">支払者</Label>
                        <Select value={payerId} onValueChange={setPayerId}>
                            <SelectTrigger id="payer">
                                <SelectValue placeholder="誰が支払いましたか？" />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map((m) => (
                                    <SelectItem key={m.id} value={m.id}>
                                        {m.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">金額</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                ¥
                            </span>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0"
                                className="pl-7 text-lg font-bold"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="1"
                            />
                        </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                        <Label htmlFor="note">詳細 (任意)</Label>
                        <Input
                            id="note"
                            placeholder="交通費、ランチ代など"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    {/* Involved Members */}
                    <div className="space-y-3">
                        <Label>対象者</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center space-x-2 rounded-md border p-2 text-sm hover:bg-slate-50"
                                >
                                    <Checkbox
                                        id={`member-${member.id}`}
                                        checked={involvedMemberIds.includes(member.id)}
                                        onCheckedChange={() => toggleMember(member.id)}
                                    />
                                    <Label
                                        htmlFor={`member-${member.id}`}
                                        className="flex-1 cursor-pointer font-normal"
                                    >
                                        {member.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {involvedMemberIds.length === 0 && (
                            <p className="text-xs text-red-500">
                                少なくとも1人選択してください
                            </p>
                        )}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            キャンセル
                        </Button>
                        <Button type="submit" disabled={!isFormValid}>
                            {initialData ? "更新する" : "追加する"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
