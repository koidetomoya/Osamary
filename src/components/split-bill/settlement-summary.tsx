import { Transaction, Member } from "@/lib/types";
import { formatCurrency } from "@/lib/logic";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CopyResultButton from "./copy-result-button";

interface SettlementSummaryProps {
    settlements: Transaction[];
    members: Member[];
}

export default function SettlementSummary({ settlements, members }: SettlementSummaryProps) {
    const getMemberName = (id: string) => members.find((m) => m.id === id)?.name || "不明";

    return (

        <Card className="bg-card border-0 shadow-sm ring-1 ring-border overflow-hidden relative">
            <div className="absolute top-2 right-2 z-10">
                <CopyResultButton settlements={settlements} members={members} />
            </div>

            <CardContent className="p-4 pt-5">
                {settlements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground gap-2">
                        <CheckCircle2 size={32} className="text-emerald-500 opacity-80" />
                        <span className="font-medium text-sm">精算完了！送金は必要ありません</span>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {settlements.map((t, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-1.5 text-sm mr-2 shrink-0">
                                    <span className="font-semibold text-foreground truncate text-right w-16 ml-1">
                                        {getMemberName(t.from)}
                                    </span>
                                    <div className="flex flex-col items-center px-1 relative h-4 justify-center w-8 shrink-0">
                                        <span className="text-[8px] text-muted-foreground absolute -top-1.5 tracking-wider font-medium scale-90">PAY</span>
                                        <div className="h-[1px] w-full bg-border relative">
                                            <div className="absolute right-0 -top-[3px] h-0 w-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-border"></div>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-foreground truncate w-16">
                                        {getMemberName(t.to)}
                                    </span>
                                </div>
                                <div className="font-mono text-lg font-bold text-foreground shrink-0">
                                    {formatCurrency(t.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
