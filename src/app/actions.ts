"use server";

import { db, TABLE_NAME } from "@/lib/dynamodb";
import { PutCommand, QueryCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { Member, Expense } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createGroup(groupId: string, name?: string) {
    // Check if group exists
    const existing = await db.send(
        new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: `GROUP#${groupId}`,
                SK: "METADATA",
            },
        })
    );

    if (!existing.Item) {
        await db.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: {
                    PK: `GROUP#${groupId}`,
                    SK: "METADATA",
                    createdAt: new Date().toISOString(),
                    name: name,
                },
            })
        );
    }
    return existing.Item;
}

export async function getGroupData(groupId: string) {
    // First get metadata (for name)
    const metadataResult = await db.send(
        new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: `GROUP#${groupId}`,
                SK: "METADATA",
            },
        })
    );

    const result = await db.send(
        new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk",
            ExpressionAttributeValues: {
                ":pk": `GROUP#${groupId}`,
            },
        })
    );

    const items = result.Items || [];
    const members = items
        .filter((item) => item.SK.startsWith("MEMBER#"))
        .map((item) => ({ id: item.id, name: item.name } as Member));

    const expenses = items
        .filter((item) => item.SK.startsWith("EXPENSE#"))
        .map((item) => ({
            id: item.id,
            amount: item.amount,
            note: item.note,
            payerId: item.payerId,
            involvedMemberIds: item.involvedMemberIds,
            date: item.date,
        } as Expense))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
        members,
        expenses,
        groupName: metadataResult.Item?.name || ""
    };
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

export async function updateExpense(groupId: string, expense: Expense) {
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
