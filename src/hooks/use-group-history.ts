"use client";

import { useState, useEffect } from "react";

export interface GroupHistoryItem {
    groupId: string;
    groupName: string;
    lastVisited: string;
}

const STORAGE_KEY = "osamary_history";

export function useGroupHistory() {
    const [history, setHistory] = useState<GroupHistoryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse history", e);
                setHistory([]);
            }
        }
        setIsLoaded(true);
    }, []);

    const saveGroup = (groupId: string, groupName: string) => {
        setHistory((prev) => {
            // Remove existing entry for this group if present
            const filtered = prev.filter((item) => item.groupId !== groupId);
            // Add new entry at the top
            const newItem: GroupHistoryItem = {
                groupId,
                groupName,
                lastVisited: new Date().toISOString(),
            };
            const newHistory = [newItem, ...filtered];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const removeGroup = (groupId: string) => {
        setHistory((prev) => {
            const newHistory = prev.filter((item) => item.groupId !== groupId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const getHistory = () => {
        return history;
    };

    return {
        history,
        isLoaded,
        saveGroup,
        removeGroup,
        getHistory,
    };
}
