export interface Member {
    id: string; // UUID
    name: string;
}

export interface Expense {
    id: string; // UUID
    amount: number;
    note: string;
    payerId: string;
    involvedMemberIds: string[]; // IDs of members who share this expense
    date: string; // ISO String
}

export interface Transaction {
    from: string; // Member ID
    to: string; // Member ID
    amount: number;
}
