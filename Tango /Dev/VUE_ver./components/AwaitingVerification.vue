<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-body text-center p-5">
                        <div class="mb-4">
                            <div class="spinner-border text-primary" role="status" style="width: 4rem; height: 4rem;">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <h2 class="card-title mb-3">Awaiting Verification</h2>
                        <p class="lead text-muted mb-4">
                            Your {{ submittedFormType }} onboarding form has been submitted and is currently under review.
                        </p>
                        
                        <div class="alert alert-info" role="alert">
                            <strong>Status:</strong> 
                            <span v-if="verificationStatus">
                                Submitted on {{ formatDate(verificationStatus.submittedAt) }}
                            </span>
                            <span v-else> Pending Review</span>
                        </div>
                        
                        <div class="mt-4">
                            <p class="text-muted">
                                You will be notified once your application has been verified. 
                                Until then, you cannot submit additional forms.
                            </p>
                        </div>
                        
                        <!-- Admin/Testing: Verification Toggle (remove in production) -->
                        <div v-if="showAdminControls" class="mt-4 pt-4 border-top">
                            <p class="text-muted small mb-2">Admin Controls (Testing Only)</p>
                            <button 
                                class="btn btn-sm btn-success"
                                @click="() => { console.log('🖱️ [BUTTON] Mark as Verified button clicked'); verifyForm(); }"
                                :disabled="isVerifying"
                            >
                                <span v-if="isVerifying" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {{ isVerifying ? 'Verifying...' : '✓ Mark as Verified' }}
                            </button>
                            <div class="mt-2 text-muted small">
                                <p class="mb-0">Debug: Check browser console for detailed logs</p>
                                <p class="mb-0">Current Status: {{ verificationState ? 'Pending Verification' : 'Missing' }} </p>
                                <p class="mb-0">
                                    Phone Number: {{ verificationState?.currentUserPhone.value || 'N/A' }} | 
                                    Form Type: {{ submittedFormTypeValue || verificationState?.state?.value?.submittedFormType || 'N/A' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, watch } from 'vue'
import type { FormType } from '../src/types/formTypes'

// Inject verification state from App.vue
const verificationState = inject<{
  state: { value: { submittedFormType: FormType | null; verified: boolean } }
  currentUserPhone: { value: string | null }
  updateVerified: (verified: boolean) => void
  hasSubmittedForm: { value: boolean }
}>('verificationState')

const verificationStatus = ref<{ submittedAt: string; verified?: boolean; formType?: FormType } | null>(null)
const submittedFormType = ref<string>('')
const submittedFormTypeValue = ref<FormType | null>(null)

const initializeFormType = () => {
    console.log('🟢 [INIT] Initializing form type from state')
    console.log('🟢 [INIT] verificationState:', verificationState)
    console.log('🟢 [INIT] verificationState?.state:', verificationState?.state)
    console.log('🟢 [INIT] verificationState?.state.value:', verificationState?.state?.value)
    console.log('🟢 [INIT] verificationState?.state.value?.submittedFormType:', verificationState?.state?.value?.submittedFormType)
    console.log('🟢 [INIT] verificationState?.currentUserPhone?.value:', verificationState?.currentUserPhone?.value)
    
    // Get the submitted form type from injected state (state is a ref, need .value)
    const stateValue = verificationState?.state?.value
    if (stateValue?.submittedFormType) {
        console.log('✅ [INIT] Setting up form type:', stateValue.submittedFormType)
        submittedFormTypeValue.value = stateValue.submittedFormType
        submittedFormType.value = stateValue.submittedFormType.charAt(0).toUpperCase() + stateValue.submittedFormType.slice(1)
        verificationStatus.value = {
            submittedAt: new Date().toISOString(), // Use current time as submitted time
            verified: stateValue.verified,
            formType: stateValue.submittedFormType
        }
        console.log('✅ [INIT] Component initialized with:', {
            submittedFormTypeValue: submittedFormTypeValue.value,
            submittedFormType: submittedFormType.value,
            verificationStatus: verificationStatus.value
        })
    } else {
        console.warn('⚠️ [INIT] No submittedFormType found in verificationState')
        console.warn('⚠️ [INIT] stateValue:', stateValue)
    }
}

onMounted(() => {
    console.log('🟢 [MOUNT] AwaitingVerification component mounted')
    initializeFormType()
})

// Watch for changes to the state in case it updates after mount
watch(() => verificationState?.state?.value?.submittedFormType, (newFormType) => {
    if (newFormType && !submittedFormTypeValue.value) {
        console.log('🔄 [WATCH] Form type updated, re-initializing:', newFormType)
        initializeFormType()
    }
})

// Watch for verification status changes (state is a ref, need .value)
// Note: No reload needed - Vue reactivity will handle showing Dashboard automatically
watch(() => verificationState?.state?.value?.verified, (verified) => {
    if (verified && verificationStatus.value) {
        console.log('🔄 [WATCH] Verification status changed to verified')
        verificationStatus.value.verified = true
        // Dashboard will appear automatically via computed property in App.vue
    }
})

const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Admin controls for testing (remove in production)
const showAdminControls = ref(true) // Set to false in production
const isVerifying = ref(false)

const verifyForm = async () => {
    console.log('🔵 [VERIFY BUTTON] Button clicked - verifyForm() called')
    console.log('🔵 [VERIFY BUTTON] verificationState:', verificationState)
    console.log('🔵 [VERIFY BUTTON] verificationState?.state?.value:', verificationState?.state?.value)
    console.log('🔵 [VERIFY BUTTON] submittedFormTypeValue.value:', submittedFormTypeValue.value)
    console.log('🔵 [VERIFY BUTTON] currentUserPhone.value:', verificationState?.currentUserPhone.value)
    
    // Try to get form type from state if not already set
    if (!submittedFormTypeValue.value && verificationState?.state?.value?.submittedFormType) {
        console.log('🔄 [VERIFY BUTTON] Form type not set, getting from state:', verificationState.state.value.submittedFormType)
        submittedFormTypeValue.value = verificationState.state.value.submittedFormType
        submittedFormType.value = verificationState.state.value.submittedFormType.charAt(0).toUpperCase() + verificationState.state.value.submittedFormType.slice(1)
    }
    
    if (!verificationState) {
        console.error('❌ [VERIFY BUTTON] verificationState is null/undefined')
        alert('Error: Verification state not available')
        return
    }
    
    if (!submittedFormTypeValue.value) {
        console.error('❌ [VERIFY BUTTON] submittedFormTypeValue is null/undefined')
        console.error('❌ [VERIFY BUTTON] State value:', verificationState?.state?.value)
        alert('Error: Form type not available. Please check console for details.')
        return
    }
    
    if (!verificationState.currentUserPhone.value) {
        console.error('❌ [VERIFY BUTTON] currentUserPhone is null/undefined')
        alert('Error: User phone number not available')
        return
    }
    
    console.log('✅ [VERIFY BUTTON] All checks passed, proceeding with verification')
    isVerifying.value = true
    console.log('🔄 [VERIFY BUTTON] isVerifying set to true')
    
    try {
        console.log('📡 [VERIFY BUTTON] Importing updateTestUser function...')
        const { updateTestUser } = await import('../src/config/testUsers')
        console.log('✅ [VERIFY BUTTON] updateTestUser imported successfully')
        
        const phoneNumber = verificationState.currentUserPhone.value
        const updates = {
            submittedFormType: submittedFormTypeValue.value,
            verified: true
        }
        
        console.log('📡 [VERIFY BUTTON] Calling updateTestUser with:', {
            phoneNumber,
            updates
        })
        
        const updatedUser = await updateTestUser(phoneNumber, updates)
        console.log('✅ [VERIFY BUTTON] updateTestUser completed successfully:', updatedUser)
        
        console.log('🔄 [VERIFY BUTTON] Updating verification state...')
        verificationState.updateVerified(true)
        console.log('✅ [VERIFY BUTTON] verificationState.updateVerified(true) called')
        
        // Update local status
        if (verificationStatus.value) {
            verificationStatus.value.verified = true
            console.log('✅ [VERIFY BUTTON] Local verificationStatus updated')
        }
        
        // State is updated - Vue reactivity will automatically show Dashboard
        // No need to reload - the computed property in App.vue will handle the UI update
        console.log('✅ [VERIFY BUTTON] Verification complete! Dashboard should appear automatically.')
        isVerifying.value = false
    } catch (error) {
        console.error('❌ [VERIFY BUTTON] Error caught:', error)
        console.error('❌ [VERIFY BUTTON] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        })
        alert(`Error updating via API: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console.`)
        isVerifying.value = false
        console.log('🔄 [VERIFY BUTTON] isVerifying set to false due to error')
    }
}
</script>

<style scoped>
.card {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>

