# Command Center - Planning Document

## Overview
The Command Center is a command palette/search modal that allows users to:
- Enter secret codes/cheat codes for special functionality
- Navigate through pages quickly
- Access hidden features and easter eggs

## Command Structure

### Command Types
1. **Secret Codes** - Preset codes that trigger special actions
2. **Navigation Commands** - Quick page navigation
3. **Action Commands** - Toggle features, change settings, etc.

---

## Secret Codes / Cheat Codes

### Format
- Case-insensitive
- Can include spaces or be written as one word
- Examples: `matrix`, `rain`, `matrix rain`, `MATRIX`

### Proposed Secret Codes

#### 1. Visual Effects
| Code | Action | Description |
|------|--------|-------------|
| `matrix` | Toggle Matrix Rain | Enable/disable the Matrix Rain effect on the current page |
| `rain` | Toggle Matrix Rain | Alias for `matrix` |
| `scramble` | Toggle Scramble Text | Enable/disable scramble text effects globally |
| `fun` | Toggle Fun Mode | Alias for enabling scramble text (matches "Enable Fun" toggle) |

#### 2. Theme & Appearance
| Code | Action | Description |
|------|--------|-------------|
| `dark` | Toggle Dark Mode | Switch between light and dark theme |
| `light` | Toggle Light Mode | Switch to light theme |
| `theme` | Cycle Theme | Cycle through available themes |

#### 3. Navigation to Secret Pages
| Code | Action | Description |
|------|--------|-------------|
| `play` | Navigate to `/play` | Go to the easter egg/play page |
| `easter` | Navigate to `/play` | Alias for `play` |
| `egg` | Navigate to `/play` | Alias for `play` |
| `test` | Navigate to `/test-parallax` | Go to the parallax test page |
| `parallax` | Navigate to `/test-parallax` | Alias for `test` |

#### 4. Special Actions
| Code | Action | Description |
|------|--------|-------------|
| `reset` | Reset Preferences | Clear all user preferences and reset to defaults |
| `clear` | Clear Cache | Clear local storage and session data |
| `about` | Show About Info | Display version info, tech stack, etc. |
| `help` | Show Help | Display all available commands |

#### 5. Developer/Admin Codes
| Code | Action | Description |
|------|--------|-------------|
| `debug` | Toggle Debug Mode | Show debug overlays, console logs, etc. |
| `dev` | Developer Tools | Access developer-only features |
| `preloader` | Force Preloader | Force show the preloader (for testing) |

---

## Navigation Commands

### Page Suggestions
When the user types, show suggestions for:
- All available pages/routes
- Recent pages (if tracked)
- Popular pages (if analytics available)

### Navigation Format
- Type page name or route
- Examples:
  - `home` → Navigate to `/`
  - `projects` → Navigate to `/projects`
  - `about` → Navigate to `/about`
  - `/play` → Navigate to `/play` (direct route)

### Suggested Pages
| Command | Route | Description |
|---------|-------|-------------|
| `home` | `/` | Landing page |
| `projects` | `/projects` | Projects showcase |
| `about` | `/about` | About page |
| `play` | `/play` | Easter egg page |
| `test` | `/test-parallax` | Parallax test page |

---

## Command Processing Logic

### Priority Order
1. **Exact Secret Code Match** - Highest priority
2. **Page Navigation Match** - Medium priority
3. **Fuzzy Search** - Lower priority (for future)

### Matching Algorithm
```typescript
1. Normalize input (lowercase, trim, remove extra spaces)
2. Check for exact secret code match
3. Check for partial secret code match (starts with)
4. Check for page name match
5. Check for route match (starts with /)
6. Show suggestions if no exact match
```

---

## UI/UX Considerations

### Search Results Display

#### Result Categories
1. **Secret Codes** (if match)
   - Icon: 🔐 or ⚡
   - Show code and description
   - Highlight matched text

2. **Navigation** (if match)
   - Icon: 🧭 or 📄
   - Show page name and route
   - Show "Press Enter to navigate"

3. **Suggestions** (if partial match)
   - Show top 5-10 matches
   - Group by category
   - Show keyboard shortcuts

### Keyboard Navigation
- `↑` / `↓` - Navigate through results
- `Enter` - Execute selected command
- `Escape` - Close command center
- `Tab` - Cycle through result categories

### Visual Feedback
- Show loading state when executing commands
- Show success/error messages
- Animate result selection
- Highlight active result

---

## Implementation Plan

### Phase 1: Basic Structure
- [x] Create CommandCenter component
- [ ] Create command registry/configuration
- [ ] Implement basic command matching
- [ ] Add search input with suggestions

### Phase 2: Secret Codes
- [ ] Implement secret code registry
- [ ] Add code execution handlers
- [ ] Create code categories (visual, theme, navigation, etc.)
- [ ] Add code aliases support

### Phase 3: Navigation
- [ ] Create page registry
- [ ] Implement page suggestion algorithm
- [ ] Add keyboard navigation
- [ ] Add recent pages tracking

### Phase 4: Advanced Features
- [ ] Fuzzy search implementation
- [ ] Command history
- [ ] Favorite commands
- [ ] Analytics tracking

---

## Command Registry Structure

```typescript
interface Command {
  id: string
  code: string | string[] // Can have multiple aliases
  type: 'secret' | 'navigation' | 'action'
  category: string
  description: string
  action: () => void | Promise<void>
  icon?: string
  keywords?: string[] // For better search matching
  requiresAuth?: boolean
  hidden?: boolean // Don't show in suggestions
}

interface CommandRegistry {
  secretCodes: Command[]
  navigation: Command[]
  actions: Command[]
}
```

---

## Example Commands Implementation

### Secret Code Example
```typescript
{
  id: 'matrix-rain',
  code: ['matrix', 'rain', 'matrix rain'],
  type: 'secret',
  category: 'visual',
  description: 'Toggle Matrix Rain effect',
  action: () => {
    // Toggle matrix rain component
    toggleMatrixRain()
  },
  icon: '🌧️',
  keywords: ['matrix', 'rain', 'effect', 'visual']
}
```

### Navigation Example
```typescript
{
  id: 'nav-play',
  code: ['play', 'easter', 'egg'],
  type: 'navigation',
  category: 'pages',
  description: 'Go to Play page',
  action: () => {
    router.push('/play')
  },
  icon: '🎮',
  keywords: ['play', 'easter', 'egg', 'fun']
}
```

---

## Future Enhancements

### Command History
- Track recently used commands
- Show history in suggestions
- Allow clearing history

### Command Favorites
- Allow users to favorite commands
- Show favorites at top of suggestions
- Quick access to frequently used commands

### Command Analytics
- Track most used commands
- Track command success/failure
- User behavior insights

### Custom Commands
- Allow users to create custom shortcuts
- Map custom codes to actions
- Share command sets

### Command Groups
- Organize commands into groups
- Filter by category
- Show category headers in results

---

## Notes

### Security Considerations
- Secret codes should not expose sensitive functionality
- Admin codes should require authentication
- Rate limiting for command execution

### Performance
- Lazy load command registry
- Debounce search input
- Cache search results
- Optimize suggestion rendering

### Accessibility
- Keyboard navigation support
- Screen reader announcements
- Focus management
- ARIA labels

---

## Questions to Resolve

1. Should secret codes be case-sensitive?
   - **Decision**: Case-insensitive for better UX

2. Should we show all commands in suggestions or only matching ones?
   - **Decision**: Only matching ones, but show categories

3. Should commands persist across page navigation?
   - **Decision**: Yes, command center is global

4. Should we track command usage?
   - **Decision**: Yes, for analytics and improving suggestions

5. How should we handle command conflicts?
   - **Decision**: First match wins, but log conflicts

---

## Next Steps

1. Create command registry configuration file
2. Implement command matching algorithm
3. Build search results UI component
4. Add keyboard navigation
5. Implement first set of secret codes
6. Add page navigation suggestions
7. Test and refine UX

