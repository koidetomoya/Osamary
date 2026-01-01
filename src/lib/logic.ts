import { Member, Expense, Transaction } from './types';

export function calculateSettlements(members: Member[], expenses: Expense[]): Transaction[] {
    if (members.length === 0) return [];

    // Calculate net balance for each member
    const balances: Record<string, number> = {};

    // Initialize balances to 0 for all members
    members.forEach((m) => (balances[m.id] = 0));

    // Process each expense
    expenses.forEach((e) => {
        // If involvedMemberIds is missing or empty, assume all current members are involved (backward compatibility)
        // Note: In a real app, we might want to store the snapshot of members at the time of expense,
        // but for now we use the involvedMemberIds if present, otherwise all members.
        const involvedIds =
            e.involvedMemberIds && e.involvedMemberIds.length > 0
                ? e.involvedMemberIds
                : members.map((m) => m.id);

        // Filter out involved IDs that might not be in the current members list (if a member was removed)
        const validInvolvedIds = involvedIds.filter((id) =>
            members.some((m) => m.id === id)
        );

        if (validInvolvedIds.length === 0) return; // Should not happen usually

        const splitAmount = e.amount / validInvolvedIds.length;

        // Payer adds to their balance (they paid, so they are owed this amount)
        if (balances[e.payerId] !== undefined) {
            balances[e.payerId] += e.amount;
        }

        // Involved members subtract from their balance (they consumed, so they owe this amount)
        validInvolvedIds.forEach((id) => {
            if (balances[id] !== undefined) {
                balances[id] -= splitAmount;
            }
        });
    });

    // Separate into debtors and creditors
    let debtors: { id: string; amount: number }[] = [];
    let creditors: { id: string; amount: number }[] = [];

    for (const memberId in balances) {
        const amount = balances[memberId];
        // Use a small epsilon for float comparison to avoid issues with floating point arithmetic
        if (amount < -0.01) {
            debtors.push({ id: memberId, amount: amount });
        } else if (amount > 0.01) {
            creditors.push({ id: memberId, amount: amount });
        }
    }

    // Sort by magnitude (largest amounts first) to optimize for fewer transactions (heuristic)
    debtors.sort((a, b) => a.amount - b.amount); // Ascending (most negative first)
    creditors.sort((a, b) => b.amount - a.amount); // Descending (most positive first)

    const transactions: Transaction[] = [];

    let i = 0; // debtor index
    let j = 0; // creditor index

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        // The amount to be settled is the minimum of what debtor owes and what creditor is owed
        const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

        // Round to 2 decimal places to be safe
        const roundedAmount = Math.round(amount * 100) / 100;

        if (roundedAmount > 0) {
            transactions.push({
                from: debtor.id,
                to: creditor.id,
                amount: roundedAmount,
            });
        }

        // Adjust balances
        debtor.amount += amount;
        creditor.amount -= amount;

        // Check if settled (using epsilon)
        if (Math.abs(debtor.amount) < 0.01) {
            i++;
        }
        if (creditor.amount < 0.01) {
            j++;
        }
    }

    return transactions;
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
}
