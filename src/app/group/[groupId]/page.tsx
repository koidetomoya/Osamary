import { getGroupData, createGroup } from "@/app/actions";
import GroupDashboard from "@/components/split-bill/group-dashboard";

interface PageProps {
    params: Promise<{ groupId: string }>;
}

export default async function GroupPage({ params }: PageProps) {
    const { groupId } = await params;

    // Ensure metadata exists or just fetch data
    // Logic updated: createGroup is called on creation, here we just get data.
    // Actually createGroup is safe to call, but we want to fetch the name.
    // Ideally page viewing shouldn't "create" with default name if it doesn't exist? 
    // For simplicity, let's just get data. If it returns empty, it's a new/empty group.

    const { members, expenses, groupName } = await getGroupData(groupId);

    // If it's a fresh URL visit without prior creation, metadata might be missing.
    // We can lazy-create if needed, but getGroupData handles default name.

    return (
        <GroupDashboard
            groupId={groupId}
            groupName={groupName}
            initialMembers={members}
            initialExpenses={expenses}
        />
    );
}
