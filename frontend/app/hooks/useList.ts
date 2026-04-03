"use client";

import { useState, useEffect } from "react";
import { MediaItem, UserListStatus } from "../types/media-item";

export function useList() {
    const [list, setList] = useState<MediaItem[]>(() => {
        if (typeof window !== "undefined") {
            const savedList = localStorage.getItem("@NerdList:items");
            return savedList ? JSON.parse(savedList) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem("@NerdList:items", JSON.stringify(list));
    }, [list]);

    const saveItem = (item: MediaItem, status: UserListStatus) => {
        setList((prev) => {
            const existingIndex = prev.findIndex((i) => i.id === item.id && i.type === item.type);
            
            if (existingIndex >= 0) {
                const newList = [...prev];
                newList[existingIndex] = { ...item, userListStatus: status };
                return newList;
            }
            
            return [...prev, { ...item, userListStatus: status }];
        });
    };

    const removeItem = (id: number | string, type: string) => {
        setList((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
    };

    const getItemStatus = (id: number | string, type: string): UserListStatus | undefined => {
        return list.find((i) => i.id === id && i.type === type)?.userListStatus;
    };

    return { list, saveItem, removeItem, getItemStatus };
}