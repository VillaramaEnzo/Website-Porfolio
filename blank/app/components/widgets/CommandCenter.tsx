"use client";

import getIcon from "@/app/utils/getIcon";
import { useCommandCenter } from "@/app/hooks/useCommandCenter";

export default function CommandCenter() {
  const {
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
  } = useCommandCenter();

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-600/50 z-100"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-0 w-screen h-screen flex flex-col items-center z-101 pointer-events-none">
        <div className="w-[640px] max-w-[calc(100vw-2rem)] mt-[30vh] bg-white rounded-xl shadow-2xl overflow-hidden pointer-events-auto">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              {getIcon("search", "text-xl")}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleInputKeyDown}
              className="w-full p-2 pl-8 outline-none border-b text-lg placeholder-gray-400"
              placeholder="Type / for routes"
              autoFocus
            />
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {inputValue.trim().startsWith("/") ? (
              routeSuggestions.length > 0 ? (
                <div className="py-2">
                  {routeSuggestions.map((route, index) => (
                    <button
                      key={route.path}
                      type="button"
                      onClick={() => handleSuggestionClick(route.path)}
                      className={`w-full text-left px-4 py-3 cursor-pointer transition-colors ${
                        index === selectedIndex
                          ? "bg-indigo-50 border-l-2 border-indigo-500"
                          : "hover:bg-gray-50"
                      }`}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-indigo-600 font-medium">
                            {route.path}
                          </span>
                          <span className="text-sm text-gray-600">{route.name}</span>
                        </div>
                        {route.description ? (
                          <span className="text-xs text-gray-400">
                            {route.description}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-gray-400">
                  <p>No matching route found.</p>
                </div>
              )
            ) : (
              <div className="p-4 text-center text-gray-400 text-sm">
                <p>
                  Press <span className="font-mono">Cmd/Ctrl + Shift + Space</span>{" "}
                  to open.
                </p>
                <p className="text-xs mt-2">
                  Type <span className="font-mono">/</span> for route suggestions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

