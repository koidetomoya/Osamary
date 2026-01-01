import { getGroupData, createGroup } from "@/app/actions";
import GroupDashboard from "@/components/split-bill/group-dashboard";

interface PageProps {
    params: Promise<{ groupId: string }>;
}

export default async function GroupPage({ params }: PageProps) {
    const { groupId } = await params;

    // Ensure metadata exists (mostly for logic/logging, not strictly required for key-value store usage)
    await createGroup(groupId);

    const { members, expenses } = await getGroupData(groupId);

    return (
        <GroupDashboard
            groupId={groupId}
            initialMembers={members}
            initialExpenses={expenses}
        />
    );
}
