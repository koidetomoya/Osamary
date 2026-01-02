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

    // Currency Support
    const [currency, setCurrency] = useState(initialData?.currencyCode || "JPY");
    const [foreignAmount, setForeignAmount] = useState(initialData?.foreignAmount?.toString() || "");
    const [exchangeRate, setExchangeRate] = useState(initialData?.exchangeRate?.toString() || "");

    // Initialize/Reset when dialog opens or initialData changes
    useEffect(() => {
        if (open) {
            setAmount(initialData?.amount.toString() || "");
            setNote(initialData?.note || "");
            setPayerId(initialData?.payerId || "");
            // If editing, use existing involved members. If creating, default to all.
            setInvolvedMemberIds(initialData?.involvedMemberIds || members.map((m) => m.id));

            setCurrency(initialData?.currencyCode || "JPY");
            setForeignAmount(initialData?.foreignAmount?.toString() || "");
            setExchangeRate(initialData?.exchangeRate?.toString() || "");
        }
    }, [open, initialData, members]);

    // Auto-calculate JPY amount when foreign amount or rate changes
    useEffect(() => {
        if (currency !== "JPY" && foreignAmount && exchangeRate) {
            const calculated = Math.round(parseFloat(foreignAmount) * parseFloat(exchangeRate));
            if (!isNaN(calculated)) {
                setAmount(calculated.toString());
            }
        }
    }, [currency, foreignAmount, exchangeRate]);

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
            currencyCode: currency,
            foreignAmount: currency !== "JPY" && foreignAmount ? parseFloat(foreignAmount) : undefined,
            exchangeRate: currency !== "JPY" && exchangeRate ? parseFloat(exchangeRate) : undefined,
        });

        setOpen(false);
        if (!initialData) {
            setAmount("");
            setNote("");
            setCurrency("JPY");
            setForeignAmount("");
            setExchangeRate("");
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

    const currencies = [
        { code: "JPY", label: "日本円 (JPY)", symbol: "¥" },
        { code: "USD", label: "米ドル (USD)", symbol: "$" },
        { code: "EUR", label: "ユーロ (EUR)", symbol: "€" },
        { code: "KRW", label: "韓国ウォン (KRW)", symbol: "₩" },
        { code: "CNY", label: "中国元 (CNY)", symbol: "¥" },
        { code: "TWD", label: "台湾ドル (TWD)", symbol: "NT$" },
        { code: "GBP", label: "英ポンド (GBP)", symbol: "£" },
        { code: "AUD", label: "豪ドル (AUD)", symbol: "A$" },
        { code: "THB", label: "タイバーツ (THB)", symbol: "฿" },
        { code: "VND", label: "ベトナムドン (VND)", symbol: "₫" },
    ];

    const currentCurrencySymbol = currencies.find(c => c.code === currency)?.symbol || "";

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

                    {/* Currency Select */}
                    <div className="space-y-2">
                        <Label htmlFor="currency">通貨</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger id="currency">
                                <SelectValue placeholder="通貨を選択" />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((c) => (
                                    <SelectItem key={c.code} value={c.code}>
                                        {c.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Foreign Amount & Rate (if not JPY) */}
                    {currency !== "JPY" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="foreignAmount">現地金額 ({currency})</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                        {currentCurrencySymbol}
                                    </span>
                                    <Input
                                        id="foreignAmount"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="pl-8"
                                        value={foreignAmount}
                                        onChange={(e) => setForeignAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="exchangeRate">レート (対円)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                                        x
                                    </span>
                                    <Input
                                        id="exchangeRate"
                                        type="number"
                                        step="0.01"
                                        placeholder="150"
                                        className="pl-6"
                                        value={exchangeRate}
                                        onChange={(e) => setExchangeRate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Amount (JPY) */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">
                            {currency === "JPY" ? "金額 (円)" : "換算金額 (円)"}
                        </Label>
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
                                readOnly={currency !== "JPY"} // Read-only if calculated from foreign currency
                            />
                        </div>
                        {currency !== "JPY" && (
                            <p className="text-xs text-slate-500 text-right">
                                ※ 精算はこの日本円換算額で行われます
                            </p>
                        )}
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
