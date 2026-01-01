import { Transaction, Member } from "@/lib/types";
import { formatCurrency } from "@/lib/logic";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CopyResultButton from "./copy-result-button";

interface SettlementSummaryProps {
    settlements: Transaction[];
    members: Member[];
}

export default function SettlementSummary({ settlements, members }: SettlementSummaryProps) {
    const getMemberName = (id: string) => members.find((m) => m.id === id)?.name || "不明";

    return (
        <Card className="bg-slate-900 text-slate-50 border-none shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-700/50 bg-slate-800/50">
                <CardTitle className="text-sm font-medium text-slate-300">
                    送金プラン
                </CardTitle>
                <CopyResultButton settlements={settlements} members={members} />
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
                {settlements.length === 0 ? (
                    <div className="flex items-center gap-2 text-emerald-400 py-2">
                        <CheckCircle2 size={20} />
                        <span className="font-semibold">精算完了！送金は必要ありません。</span>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {settlements.map((t, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-red-300">
                                        {getMemberName(t.from)}
                                    </span>
                                    <ArrowRight size={16} className="text-slate-500" />
                                    <span className="font-medium text-emerald-300">
                                        {getMemberName(t.to)}
                                    </span>
                                </div>
                                <div className="font-mono text-lg font-bold">
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
