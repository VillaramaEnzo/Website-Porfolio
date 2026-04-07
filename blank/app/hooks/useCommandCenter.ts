"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import {
  getAutocompleteRoutes,
  getNavigationPath,
  isValidRoute,
} from "@/app/utils/routes";

export function useCommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const routeSuggestions = useMemo(() => {
    const trimmed = inputValue.trim();
    return trimmed.startsWith("/") ? getAutocompleteRoutes(trimmed) : [];
  }, [inputValue]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === " ") {
        event.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) {
            setInputValue("");
            setSelectedIndex(0);
          }
          return next;
        });
      }

      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setInputValue("");
        setSelectedIndex(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleNavigate = (path: string): boolean => {
    const trimmedPath = path.trim();

    if (!trimmedPath.startsWith("/")) {
      return false;
    }

    if (!isValidRoute(trimmedPath)) {
      return false;
    }

    router.push(getNavigationPath(trimmedPath));
    setIsOpen(false);
    setInputValue("");
    setSelectedIndex(0);
    return true;
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedInput = inputValue.trim();

      if (!trimmedInput) {
        setIsOpen(false);
        return;
      }

      if (routeSuggestions.length > 0 && selectedIndex < routeSuggestions.length) {
        handleNavigate(routeSuggestions[selectedIndex].path);
        return;
      }

      handleNavigate(trimmedInput);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const maxIndex = routeSuggestions.length - 1;
      setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleSuggestionClick = (path: string) => {
    handleNavigate(path);
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return {
    isOpen,
    inputValue,
    selectedIndex,
    inputRef,
    routeSuggestions,
    setIsOpen,
    setInputValue,
    setSelectedIndex,
    handleInputKeyDown,
    handleSuggestionClick,
  };
}

