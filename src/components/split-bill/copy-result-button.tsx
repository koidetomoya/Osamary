import { Transaction, Member } from "@/lib/types";
import { formatCurrency } from "@/lib/logic";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CopyResultButtonProps {
    settlements: Transaction[];
    members: Member[];
}

export default function CopyResultButton({ settlements, members }: CopyResultButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const getMemberName = (id: string) => members.find((m) => m.id === id)?.name || "不明";

        const lines = [
            "💰 精算リスト",
            "----------------",
            ...settlements.map(
                (t) =>
                    `${getMemberName(t.from)} → ${getMemberName(t.to)}: ${formatCurrency(t.amount)}`
            ),
            "----------------",
            "----------------",
            `アプリで確認: ${window.location.href}`,
        ];

        navigator.clipboard.writeText(lines.join("\n"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={settlements.length === 0}
            className={`rounded-full transition-all ${copied ? "text-green-600 bg-green-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            title="結果をコピー"
        >
            {copied ? <Check size={18} /> : <Copy size={18} />}
        </Button>
    );
}
