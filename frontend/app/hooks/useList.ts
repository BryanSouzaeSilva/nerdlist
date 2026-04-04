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

    const [pins, setPins] = useState<MediaItem[]>(() => {
        if (typeof window !== "undefined") {
            const savedPins = localStorage.getItem("@NerdList:pins");
            return savedPins ? JSON.parse(savedPins) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem("@NerdList:items", JSON.stringify(list));
    }, [list]);

    useEffect(() => {
        localStorage.setItem("@NerdList:pins", JSON.stringify(pins));
    }, [pins]);

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
        setPins((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
    };

    const togglePin = (item: MediaItem) => {
        setPins((prev) => {
            const isAlreadyPinned = prev.some(p => p.id === item.id && p.type === item.type);
            if (isAlreadyPinned) {
                return prev.filter(p => !(p.id === item.id && p.type === item.type));
            }
            const otherTypes = prev.filter(p => p.type !== item.type);
            return [...otherTypes, item].slice(0, 5);
        });
    };

    const getItemStatus = (id: number | string, type: string): UserListStatus | undefined => {
        return list.find((i) => i.id === id && i.type === type)?.userListStatus;
    };

    const isPinned = (id: number | string, type: string) => {
        return pins.some(p => p.id === id && p.type === type);
    };

    return { list, pins, saveItem, removeItem, togglePin, getItemStatus, isPinned };
}