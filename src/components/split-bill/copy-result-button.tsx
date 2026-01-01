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
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={settlements.length === 0}
            className={`transition-all ${copied ? "bg-green-50 text-green-600 border-green-200" : ""}`}
        >
            {copied ? (
                <>
                    <Check size={16} className="mr-2" />
                    コピー完了
                </>
            ) : (
                <>
                    <Copy size={16} className="mr-2" />
                    結果をコピー
                </>
            )}
        </Button>
    );
}
