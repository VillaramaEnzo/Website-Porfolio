"use client"

import { createContext, useContext } from "react";
import { useScrollManager } from "@/hooks/useScrollManager";

// Define what useScrollManager returns
type ScrollManagerReturn = ReturnType<typeof useScrollManager>;

// Use the return type directly instead of defining our own interface
const ScrollContext = createContext<ScrollManagerReturn | null>(null);

export const useScrollContext = () => {
    const context = useContext(ScrollContext);

    if (!context) {
        throw new Error("useScrollContext must be used within a ScrollProvider");
    }

    return context;
};

export interface ScrollProviderProps {
    children: React.ReactNode;
    containerRef?: React.RefObject<HTMLElement>; // Optional - if not provided, uses window scroll (parallax-friendly)
    sectionRefs?: React.RefObject<(HTMLElement | null)[]>;
    sectionNames?: string[];
}

export const ScrollProvider: React.FC<ScrollProviderProps> = ({ children, containerRef, sectionRefs, sectionNames }) => { 
    const scrollManager = useScrollManager({ 
        containerRef, 
        sectionRefs: sectionRefs as React.RefObject<(HTMLElement | null)[]>,
        sectionNames: sectionNames
    });

    return (
        <ScrollContext.Provider value={scrollManager}>
            {children}
        </ScrollContext.Provider>
    );
};

