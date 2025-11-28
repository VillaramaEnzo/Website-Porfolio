// Vite plugin to provide API endpoints for test users data
import type { Plugin } from 'vite'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function updateTestUsersPlugin(): Plugin {
  return {
    name: 'test-users-api',
    // Use enforce: 'pre' to ensure this runs before other middleware (including SPA fallback)
    enforce: 'pre',
    configureServer(server) {
      // Register at root level to catch /api/test-users before SPA fallback
      server.middlewares.use((req, res, next) => {
        const url = req.url || ''
        
        // Only handle /api/test-users routes
        if (!url.startsWith('/api/test-users')) {
          next()
          return
        }
        
        console.log(`🔵 [API MIDDLEWARE] ${req.method} ${url}`)
        
        // GET /api/test-users - Get all test users
        if (req.method === 'GET' && (url === '/api/test-users' || url === '/api/test-users/')) {
          try {
            console.log('📡 [API MIDDLEWARE] Handling GET all users')
            const testUsersPath = join(__dirname, '../src/data/testUsers.json')
            const data = readFileSync(testUsersPath, 'utf-8')
            const testUsers = JSON.parse(data)
            
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify(testUsers))
            console.log('✅ [API MIDDLEWARE] Sent all users response')
            return // Don't call next() - we handled the request
          } catch (error: any) {
            console.error('❌ [API MIDDLEWARE] Error:', error)
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 500
            res.end(JSON.stringify({ error: error.message }))
            return
          }
        }
        
        // GET /api/test-users/:phoneNumber - Get specific test user
        if (req.method === 'GET' && url.startsWith('/api/test-users/') && url !== '/api/test-users/') {
          try {
            const phoneNumber = url.replace('/api/test-users/', '').split('?')[0]
            console.log('📡 [API MIDDLEWARE] Handling GET user:', phoneNumber)
            
            if (!phoneNumber || phoneNumber === '') {
              next()
              return
            }
            
            const testUsersPath = join(__dirname, '../src/data/testUsers.json')
            const data = readFileSync(testUsersPath, 'utf-8')
            const testUsers = JSON.parse(data)
            const user = testUsers.find((u: any) => u.phoneNumber === phoneNumber)
            
            res.setHeader('Content-Type', 'application/json')
            if (user) {
              res.statusCode = 200
              res.end(JSON.stringify(user))
              console.log('✅ [API MIDDLEWARE] Sent user response')
            } else {
              res.statusCode = 404
              res.end(JSON.stringify({ error: 'User not found' }))
              console.log('❌ [API MIDDLEWARE] User not found')
            }
            return // Don't call next() - we handled the request
          } catch (error: any) {
            console.error('❌ [API MIDDLEWARE] Error:', error)
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 500
            res.end(JSON.stringify({ error: error.message }))
            return
          }
        }
        
        // PUT /api/test-users/:phoneNumber - Update specific test user
        if (req.method === 'PUT' && url.startsWith('/api/test-users/') && url !== '/api/test-users/') {
          const phoneNumber = url.replace('/api/test-users/', '').split('?')[0]
          console.log('📡 [API MIDDLEWARE] Handling PUT user:', phoneNumber)
          
          if (!phoneNumber || phoneNumber === '') {
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Phone number required' }))
            return
          }
          
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })

          req.on('end', () => {
            try {
              const updates = JSON.parse(body)
              console.log('📡 [API MIDDLEWARE] Updates:', updates)
              
              const testUsersPath = join(__dirname, '../src/data/testUsers.json')
              const data = readFileSync(testUsersPath, 'utf-8')
              const testUsers: any[] = JSON.parse(data)
              
              const userIndex = testUsers.findIndex(u => u.phoneNumber === phoneNumber)
              if (userIndex === -1) {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 404
                res.end(JSON.stringify({ error: 'User not found' }))
                return
              }
              
              // Update user
              testUsers[userIndex] = {
                ...testUsers[userIndex],
                ...updates
              }
              
              // Write back to file
              writeFileSync(testUsersPath, JSON.stringify(testUsers, null, 2), 'utf-8')
              
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ success: true, user: testUsers[userIndex] }))
              console.log('✅ [API MIDDLEWARE] User updated successfully')
            } catch (error: any) {
              console.error('❌ [API MIDDLEWARE] Error updating user:', error)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 500
              res.end(JSON.stringify({ error: error.message }))
            }
          })
          return // Don't call next() - we're handling the request
        }
        
        // If no match, continue to next middleware
        console.log('⚠️ [API MIDDLEWARE] No handler matched, calling next()')
        next()
      })
    }
  }
}

