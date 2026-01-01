"use server";

import { db, TABLE_NAME } from "@/lib/dynamodb";
import { PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { Member, Expense } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getGroupData(groupId: string) {
    try {
        const { Items } = await db.send(
            new QueryCommand({
                TableName: TABLE_NAME,
                KeyConditionExpression: "PK = :pk",
                ExpressionAttributeValues: {
                    ":pk": `GROUP#${groupId}`,
                },
            })
        );

        const members: Member[] = [];
        const expenses: Expense[] = [];

        (Items || []).forEach((item) => {
            if (item.SK.startsWith("MEMBER#")) {
                members.push({
                    id: item.id,
                    name: item.name
                });
            } else if (item.SK.startsWith("EXPENSE#")) {
                expenses.push({
                    id: item.id,
                    amount: item.amount,
                    note: item.note,
                    payerId: item.payerId,
                    involvedMemberIds: item.involvedMemberIds || [],
                    date: item.date
                });
            }
        });

        return { members, expenses };
    } catch (error) {
        console.error("Failed to fetch group data:", error);
        return { members: [], expenses: [] };
    }
}

export async function createGroup(groupId: string) {
    // Just create a metadata item to reserve the group ID if needed,
    // or simply do nothing as we query by PK.
    // For now, let's just log it or put a metadata item.
    await db.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                PK: `GROUP#${groupId}`,
                SK: "METADATA",
                createdAt: new Date().toISOString(),
            }
        })
    );
}

export async function addMember(groupId: string, member: Member) {
    await db.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                PK: `GROUP#${groupId}`,
                SK: `MEMBER#${member.id}`,
                ...member,
            },
        })
    );
    revalidatePath(`/group/${groupId}`);
}

export async function deleteMember(groupId: string, memberId: string) {
    await db.send(
        new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: `GROUP#${groupId}`,
                SK: `MEMBER#${memberId}`,
            },
        })
    );
    revalidatePath(`/group/${groupId}`);
}

export async function addExpense(groupId: string, expense: Expense) {
    await db.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                PK: `GROUP#${groupId}`,
                SK: `EXPENSE#${expense.id}`,
                ...expense,
            },
        })
    );
    revalidatePath(`/group/${groupId}`);
}

export async function deleteExpense(groupId: string, expenseId: string) {
    await db.send(
        new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: `GROUP#${groupId}`,
                SK: `EXPENSE#${expenseId}`,
            },
        })
    );
    revalidatePath(`/group/${groupId}`);
}
