"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { createGroup } from "@/app/actions";
import LineLoginButton from "@/components/line-login-button";
import MyGroups from "@/components/my-groups";

export default function Home() {
  const router = useRouter();

  const [groupName, setGroupName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = async () => {
    setIsCreating(true);
    const groupId = uuidv4();
    try {
      await createGroup(groupId, groupName); // Call Server Action
      router.push(`/group/${groupId}`);
    } catch (e) {
      console.error(e);
      setIsCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4 text-center">
      <div className="absolute top-4 right-4">
        <LineLoginButton />
      </div>

      <div className="max-w-md space-y-8 w-full">
        <div className="space-y-4">

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Osamari
          </h1>
          <p className="mt-4 text-slate-600">
            リンクをシェアして支払いを入力するだけ。
            <br />
            面倒な割り勘計算が一瞬で完結します。
          </p>
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-left block text-sm font-medium text-slate-700">グループ名 (任意)</Label>
            <Input
              id="groupName"
              placeholder="例: 北海道旅行、BBQなど"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="text-base"
            />
          </div>
          <Button onClick={handleCreateGroup} disabled={isCreating} className="w-full text-lg h-12 rounded-xl" size="lg">
            {isCreating ? "作成中..." : "新しいグループを作成"}
            {!isCreating && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
          <p className="text-xs text-slate-400">
            ログイン不要・即座に使い始められます
          </p>
        </div>

        <MyGroups />
      </div>
    </div>
  );
}
