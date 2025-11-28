<template>
  <div id="app">
    <!-- Authentication Views -->
    <Login 
      v-if="!isAuthenticated && !showSignup" 
      :onLogin="handleLogin"
      @switch-to-signup="showSignup = true"
    />
    <Signup
      v-if="!isAuthenticated && showSignup"
      :onSignUp="handleSignUp"
      @switch-to-login="showSignup = false"
    />
    
    <!-- Main App (after authentication) -->
    <template v-if="isAuthenticated">
      <Nav />
      <!-- Show Dashboard if verified, otherwise show Forms (which handles awaiting verification) -->
      <Dashboard 
        v-if="verifiedFormType" 
        :form-type="verifiedFormType"
      />
      <Forms v-else />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import Nav from '../components/Nav.vue'
import Forms from '../components/Forms.vue'
import Dashboard from '../components/Dashboard.vue'
import Login from '../components/Login.vue'
import Signup from '../components/Signup.vue'
import { validateTestUser, getInitialVerificationState, type TestUser } from './config/testUsers'
import type { LoginCredentials, SignUpData } from './types/auth'
import type { FormType } from './types/formTypes'

const isAuthenticated = ref(false)
const showSignup = ref(false)

// In-memory state for current user (not using localStorage)
const currentUser = ref<TestUser | null>(null)
const userVerificationState = ref<{
  submittedFormType: FormType | null
  verified: boolean
}>({
  submittedFormType: null,
  verified: false
})

// Check if user has a verified form (should see dashboard)
const verifiedFormType = computed(() => {
  if (userVerificationState.value.verified && userVerificationState.value.submittedFormType) {
    return userVerificationState.value.submittedFormType
  }
  return null
})

// Computed for hasSubmittedForm
const hasSubmittedForm = computed(() => {
  return userVerificationState.value.submittedFormType !== null && !userVerificationState.value.verified
})

// Provide verification state to child components
provide('verificationState', {
  state: userVerificationState,
  currentUserPhone: computed(() => currentUser.value?.phoneNumber || null),
  updateSubmitted: (formType: FormType) => {
    userVerificationState.value.submittedFormType = formType
    userVerificationState.value.verified = false
  },
  updateVerified: (verified: boolean) => {
    if (userVerificationState.value.submittedFormType) {
      userVerificationState.value.verified = verified
    }
  },
  hasSubmittedForm
})

// Login handler - only accepts test user credentials
const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    // Validate against test users via API
    const user = await validateTestUser(credentials.phoneNumber.trim(), credentials.password)
    
    if (!user) {
      return false
    }
    
    // Store current user
    currentUser.value = user
    
    // Initialize user's verification status from test user config (in-memory only)
    const verificationState = getInitialVerificationState(user)
    userVerificationState.value = {
      submittedFormType: verificationState.submittedFormType || null,
      verified: verificationState.verified
    }
    
    isAuthenticated.value = true
    return true
  } catch (error) {
    console.error('Login error:', error)
    return false
  }
}

// Signup handler - disabled for now, only test users can login
const handleSignUp = async (data: SignUpData): Promise<boolean> => {
  // For testing, signup is disabled - users must use test credentials
  // In production, this would create a new user account
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Show message that signup is disabled
  alert('Signup is currently disabled. Please use one of the test user credentials to login.\n\nSee src/data/testUsers.json for available test accounts.')
  
  return false
}
</script>

<style scoped></style>
