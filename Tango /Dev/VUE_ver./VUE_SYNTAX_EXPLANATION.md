# Vue Syntax: Standalone vs Vue App

## Two Different Approaches

### 1. **Standalone HTML Page (CDN/Script Tag)**
This is what you saw in the Envato tutorial. Vue is included via a `<script>` tag, and you create/mount the app directly in your HTML.

**Example:**
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        <h1>{{ message }}</h1>
        <button @click="count++">Count: {{ count }}</button>
    </div>
    
    <script>
        const { createApp } = Vue;
        
        createApp({
            data() {
                return {
                    message: 'Hello Vue!',
                    count: 0
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
```

**Key Points:**
- ✅ You DO use `createApp()` and `.mount()`
- ✅ Everything is in one HTML file (or separate JS file)
- ✅ Vue is loaded from CDN
- ✅ Uses Options API syntax (`data()`, `methods`, etc.)
- ✅ Good for simple pages or learning

---

### 2. **Vue App (Vite/CLI - Your Current Setup)**
This is a full Vue project with build tools. The app is created ONCE in `main.ts`, and components just define their logic.

**Your Project Structure:**
```
tango/
├── index.html          ← Has <div id="app"></div>
├── src/
│   ├── main.ts         ← Creates and mounts the app HERE
│   ├── App.vue         ← Root component
│   └── components/
│       └── Test.vue    ← Just defines component logic
```

**main.ts (Your Entry Point):**
```typescript
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)  // ← App is created HERE
app.mount('#app')           // ← App is mounted HERE
```

**Test.vue (Component):**
```vue
<script setup lang="ts">
import { ref } from 'vue'

// ❌ NO createApp() here!
// ❌ NO .mount() here!
// ✅ Just define your component's reactive data

const activePage = ref(0)
const pages = [...]
</script>
```

**Key Points:**
- ❌ Components DON'T use `createApp()` or `.mount()`
- ✅ App is created ONCE in `main.ts`
- ✅ Components use `<script setup>` (Composition API)
- ✅ Uses `ref()`, `reactive()`, etc. for reactivity
- ✅ Better for larger applications
- ✅ Has build tools, hot reload, TypeScript support

---

## Can You Still Use createApp in Components?

**Short answer: Technically yes, but DON'T!** It would create a nested app, which is almost never what you want.

**What happens if you try:**
```vue
<script setup lang="ts">
import { createApp } from 'vue'

// This would create a NEW app inside your component
// It would try to mount to something, but you're already inside a mounted app
// This causes conflicts and errors!
const app = createApp({...})
app.mount('#something')  // ❌ Don't do this!
</script>
```

**Why it doesn't work:**
- Your app is already mounted in `main.ts`
- Creating another app inside a component creates a nested app
- This breaks the component tree and causes issues

---

## Summary

| Feature | Standalone HTML | Vue App (Your Setup) |
|---------|----------------|---------------------|
| **createApp()** | ✅ Yes, in HTML/script | ✅ Yes, but only in `main.ts` |
| **.mount()** | ✅ Yes, in HTML/script | ✅ Yes, but only in `main.ts` |
| **Components** | ❌ No separate files | ✅ Yes, `.vue` files |
| **Script Setup** | ❌ Not typically used | ✅ Yes, recommended |
| **Build Tools** | ❌ None | ✅ Vite, TypeScript, etc. |
| **Use Case** | Simple pages, tutorials | Full applications |

---

## Your Current Setup (Correct Way)

```vue
<!-- Test.vue -->
<template>
  <!-- Your template -->
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ✅ This is correct for a component
const activePage = ref(0)
const pages = [...]
</script>
```

The app creation and mounting happens in `main.ts`, not in your components!

