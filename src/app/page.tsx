"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { ArrowRight, ReceiptJapaneseYen } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const createGroup = () => {
    const groupId = uuidv4();
    router.push(`/group/${groupId}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4 text-center">
      <div className="max-w-md space-y-8">
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <ReceiptJapaneseYen size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Split Bill App
          </h1>
          <p className="text-lg text-slate-600">
            友人との旅行や食事の割り勘を、<br />
            最短・最小の送金回数で精算。
          </p>
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            ログイン不要。URLを共有するだけで<br />
            すぐに使い始められます。
          </p>
          <Button onClick={createGroup} className="w-full text-lg h-12 rounded-xl" size="lg">
            新しいグループを作成
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
