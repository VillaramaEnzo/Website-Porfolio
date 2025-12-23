'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useCommandCenter } from '@/hooks'
import getIcon from '@/utils/getIcon'

/**
 * CommandCenter Component
 * 
 * A command palette/search modal that opens with Cmd/Ctrl + Shift + Space
 * - Opens with: Cmd/Ctrl + Shift + Space
 * - Closes with: Escape or Enter
 * - Prevents opening on mobile devices
 * - Prevents opening when preloader is showing
 * - Route navigation: Type a route (e.g., /about) and press Enter to navigate
 */
export default function CommandCenter() {
  const {
    isOpen,
    inputValue,
    selectedIndex,
    isValidatingCode,
    secretCodeValidation,
    inputRef,
    routeSuggestions,
    codeSuggestions,
    setIsOpen,
    setInputValue,
    setSelectedIndex,
    handleInputKeyDown,
    handleSuggestionClick,
    handlePublicCode,
  } = useCommandCenter()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 z-[100]"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Command Center Modal */}
          <div className="fixed inset-0 w-screen h-screen flex flex-col items-center z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ ease: [0.16, 1, 0.3, 1] }}
              className="w-[640px] max-w-[calc(100vw-2rem)] mt-[30vh] bg-white rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Search Input */}
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                  {getIcon('search', 'text-xl')}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  className="w-full p-2 pl-8 outline-none border-b text-lg placeholder-gray-400"
                  placeholder="Website Search"
                  autoFocus
                />
              </div>
              
              {/* Search Results Container */}
              <div className="max-h-[60vh] overflow-y-auto">
                {inputValue.trim().startsWith('/') ? (
                  routeSuggestions.length > 0 ? (
                    <div className="py-2">
                      {routeSuggestions.map((route, index) => (
                        <motion.div
                          key={route.path}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => handleSuggestionClick(route.path)}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            index === selectedIndex
                              ? 'bg-indigo-50 border-l-2 border-indigo-500'
                              : 'hover:bg-gray-50'
                          }`}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm text-indigo-600 font-medium">
                                {route.path}
                              </span>
                              <span className="text-sm text-gray-600">
                                {route.name}
                              </span>
                            </div>
                            {route.description && (
                              <span className="text-xs text-gray-400">
                                {route.description}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-gray-400">
                      <p>No matching route found.</p>
                      <p className="text-xs mt-1">Try typing a route like <span className="font-mono">/home</span>, <span className="font-mono">/about</span>, or <span className="font-mono">/projects</span></p>
                    </div>
                  )
                ) : inputValue.trim() ? (
                  codeSuggestions.length > 0 ? (
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-200">
                        Suggestions
                      </div>
                      {codeSuggestions.map((code, index) => (
                        <motion.div
                          key={code.code}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => {
                            handlePublicCode(code.code)
                          }}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            index === selectedIndex
                              ? 'bg-indigo-50 border-l-2 border-indigo-500'
                              : 'hover:bg-gray-50'
                          }`}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm text-indigo-600 font-medium">
                                {code.code}
                              </span>
                              <span className="text-sm text-gray-600">
                                {code.description}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : isValidatingCode ? (
                    <div className="p-4 text-sm text-gray-400">
                      <p>Validating code...</p>
                    </div>
                  ) : secretCodeValidation?.error ? (
                    <div className="p-4 text-sm text-red-600">
                      <p className="mb-1">{secretCodeValidation.error}</p>
                      {secretCodeValidation.retryAfter && (
                        <p className="text-xs text-red-500 mt-1">
                          Try again in {Math.ceil(secretCodeValidation.retryAfter / 60)} minute(s)
                        </p>
                      )}
                    </div>
                  ) : secretCodeValidation?.valid ? (
                    <div className="p-4 text-sm text-gray-600">
                      <p className="mb-2">Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to execute:</p>
                      <p className="font-mono text-indigo-600 text-xs">{inputValue.trim()}</p>
                      {secretCodeValidation.description && (
                        <p className="text-xs text-gray-500 mt-1">{secretCodeValidation.description}</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-gray-400">
                      <p>Type <span className="font-mono">/</span> to see route suggestions</p>
                      <p className="text-xs mt-1">Or enter a code...</p>
                    </div>
                  )
                ) : (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    <p>Type <span className="font-mono">/</span> to see route suggestions</p>
                    <p className="text-xs mt-2">Or enter a cheat code...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
