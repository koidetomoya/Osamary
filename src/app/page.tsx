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
    <div className="relative flex flex-col items-center p-4 text-center h-full overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[100px] pointer-events-none" />
      {/* Login button moved to MyGroups component */}

      <div className="w-full max-w-5xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-16 items-center h-full">
        {/* Left Column: Hero & Create Form - Fixed on mobile, centered on desktop */}
        <div className="space-y-8 text-left md:py-12 flex-none pt-36 md:pt-0">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Osamary
            </h1>
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
              リンクをシェアして支払いを入力するだけ。
              <br />
              面倒な割り勘計算が一瞬で完結します。
            </p>
          </div>

          <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
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
          </div>
        </div>

        {/* Right Column: History - Scrollable */}
        <div className="w-full flex-1 md:h-full md:flex-none md:flex md:items-center overflow-y-auto min-h-0 pb-4 md:pb-0 scrollbar-hide">
          <MyGroups />
        </div>
      </div>
    </div>
  );
}
