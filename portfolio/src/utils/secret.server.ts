/**
 * Secret Command Codes (Server-Side Only)
 * 
 * Stores secret codes as a JSON object with action types.
 * This file is ONLY imported by server-side code (API routes).
 * It will NOT be bundled with the client - codes stay secure on the server.
 * 
 * Format:
 * {
 *   "code": {
 *     "description": "User-friendly description",
 *     "action": "action_type" // Used by client to execute (no code strings exposed)
 *   }
 * }
 * 
 * Codes can be any valid string:
 * - #remix, #basic (hash-based)
 * - funmode:on, funmode:off (colon-based)
 * - anyvalidstring (plain string)
 * 
 * To add new codes, just add them here with an action type.
 */

export interface SecretCodeConfig {
  description: string
  action: string // Action type that client uses (not the code itself)
}

export const SECRET_CODES_DATA: Record<string, SecretCodeConfig> = {
  '#remix': {
    description: 'Remix this site',
    action: 'enable_remix_mode',
  },
  '#basic': {
    description: 'Back to being basic',
    action: 'enable_basic_mode',
  },
  // Just add new codes here! 🎉
  // 'yourcode:here': {
  //   description: 'What this code does',
  //   action: 'your_action_type',
  // },
} as const

