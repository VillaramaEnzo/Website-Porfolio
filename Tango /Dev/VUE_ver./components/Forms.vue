<template>
    <div class="container mt-4">
        <!-- Awaiting Verification Screen -->
        <AwaitingVerification v-if="hasSubmittedForm && !isVerified" />
        
        <!-- Form Selection Grid (only if no submitted form and not verified) -->
        <div v-else-if="!selectedForm && !isVerified" class="row g-3" style="max-width: 800px; margin: 0 auto;">
            <div 
                v-for="(form, index) in formOptions" 
                :key="index" 
                class="col-4"
            >
                <div class="d-flex flex-column h-100">
                    <button
                        class="btn btn-outline-primary w-100 flex-grow-1 d-flex flex-column align-items-center justify-content-center"
                        style="min-height: 120px; font-size: 1.25rem;"
                        @click="selectForm(form, false)"
                    >
                        {{ form.name }}
                    </button>
                    <div v-if="hasSavedForm(form.type)" class="mt-2 text-center">
                        <button
                            class="btn btn-sm btn-success w-100 mb-1"
                            @click="selectForm(form, true)"
                        >
                            Continue Saved Form
                        </button>
                        <button
                            class="btn btn-sm btn-outline-danger w-100"
                            @click="deleteSavedForm(form.type)"
                        >
                            Delete Saved Form
                        </button>
                    </div>
                </div>
            </div>
            <!-- Empty slots to fill 3x3 grid -->
            <div v-for="n in 6" :key="`empty-${n}`" class="col-4">
                <div class="w-100" style="min-height: 120px;"></div>
            </div>
        </div>
        
        <!-- Form Content -->
        <OnboardingForm
            v-else
            :form-type="selectedForm?.type as 'agent' | 'borrower' | 'lender'"
            :form-title="selectedForm?.pageTitle || ''"
            :form-fields="getFormFields(selectedForm?.type as 'agent' | 'borrower' | 'lender')"
            :document-requirements="getDocumentRequirements(selectedForm?.type as 'agent' | 'borrower' | 'lender')"
            :on-submit="handleFormSubmitWithRefresh"
            :load-saved-data="loadSavedData"
            @go-back="goBack"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import OnboardingForm from './OnboardingForm.vue'
import AwaitingVerification from './AwaitingVerification.vue'
import { formStorage } from '../src/services/formStorage'
import type { OnboardingSubmission, DocumentRequirement } from '../src/types/onboarding'
import type { FormType } from '../src/types/formTypes'

// Inject verification state from App.vue
const verificationState = inject<{
  state: { value: { submittedFormType: FormType | null; verified: boolean } }
  updateSubmitted: (formType: FormType) => void
  updateVerified: (verified: boolean) => void
  hasSubmittedForm: { value: boolean }
}>('verificationState')

interface FormOption {
    name: string
    type: string
    pageTitle: string
    pageContent: string
}

interface FormField {
    id: string
    key: string
    label: string
    type: string
    placeholder: string
    required?: boolean
    pattern?: string
    minlength?: number
}

const selectedForm = ref<FormOption | null>(null)
const loadSavedData = ref(false)
const refreshKey = ref(0) // Force reactivity for saved form checks

// Check if user is verified (should not see forms)
const isVerified = computed(() => {
    return verificationState?.state.value.verified === true
})

// Check if user has submitted a form (awaiting verification)
const hasSubmittedForm = computed(() => {
    return verificationState?.hasSubmittedForm.value === true
})

const formOptions: FormOption[] = [
    { 
        name: 'Agent Onboarding', 
        type: 'agent',
        pageTitle: 'Agent Onboarding',
        pageContent: 'Agent Onboarding form content goes here.'
    },
    { 
        name: 'Borrower Onboarding', 
        type: 'borrower',
        pageTitle: 'Borrower Onboarding',
        pageContent: 'Borrower Onboarding form content goes here.'
    },
    { 
        name: 'Lender Onboarding', 
        type: 'lender',
        pageTitle: 'Lender Onboarding',
        pageContent: 'Lender Onboarding form content goes here.'
    },
    {
        name: "Supervisor Onboarding",
        type: 'supervisor',
        pageTitle: 'Supervisor Onboarding',
        pageContent: 'Supervisor Onboarding form content goes here.',
    },
    {
        name: "Admin Onboarding",
        type: 'admin',
        pageTitle: 'Admin Onboarding',
        pageContent: 'Admin Onboarding form content goes here.',
    },
    {   
        name: "Partner Onboarding",
        type: 'partner',
        pageTitle: 'Partner Onboarding',
        pageContent: 'Partner Onboarding form content goes here.',
    },
]

const selectForm = (form: FormOption, continueSaved: boolean = false) => {
    selectedForm.value = form
    loadSavedData.value = continueSaved
}

const goBack = () => {
    selectedForm.value = null
    loadSavedData.value = false
}

// Check if saved forms exist (with reactivity)
const hasSavedForm = (formType: string): boolean => {
    // Access refreshKey to make it reactive
    refreshKey.value
    return formStorage.hasSavedForm(formType as 'agent' | 'borrower' | 'lender')
}

const deleteSavedForm = (formType: string) => {
    if (confirm('Are you sure you want to delete your saved form? This cannot be undone.')) {
        formStorage.deleteSavedForm(formType as 'agent' | 'borrower' | 'lender')
        // Force reactivity update
        refreshKey.value++
    }
}

// Watch for form submission to refresh saved form status
const handleFormSubmitWithRefresh = async (submission: OnboardingSubmission): Promise<boolean> => {
    const result = await handleFormSubmit(submission)
    if (result) {
        // Form submitted successfully, refresh to update UI
        refreshKey.value++
    }
    return result
}

// Define form fields for each onboarding type
const getFormFields = (formType: string): FormField[] => {
    const baseFields: FormField[] = [
        {
            id: 'fullName',
            key: 'fullName',
            label: 'Full Name',
            type: 'text',
            placeholder: 'Enter your full name',
            required: true
        },
        {
            id: 'email',
            key: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'Enter your email',
            required: true
        },
        {
            id: 'phoneNumber',
            key: 'phoneNumber',
            label: 'Phone Number',
            type: 'tel',
            placeholder: 'Enter your phone number',
            required: true
        }
    ]
    
    // Add type-specific fields
    if (formType === 'agent') {
        return [
            ...baseFields,
            {
                id: 'licenseNumber',
                key: 'licenseNumber',
                label: 'License Number',
                type: 'text',
                placeholder: 'Enter your license number',
                required: true
            },
            {
                id: 'yearsOfExperience',
                key: 'yearsOfExperience',
                label: 'Years of Experience',
                type: 'number',
                placeholder: 'Enter years of experience',
                required: true
            }
        ]
    } else if (formType === 'borrower') {
        return [
            ...baseFields,
            {
                id: 'loanAmount',
                key: 'loanAmount',
                label: 'Desired Loan Amount',
                type: 'number',
                placeholder: 'Enter desired loan amount',
                required: true
            },
            {
                id: 'purpose',
                key: 'purpose',
                label: 'Loan Purpose',
                type: 'text',
                placeholder: 'Describe the purpose of the loan',
                required: true
            }
        ]
    } else if (formType === 'lender') {
        return [
            ...baseFields,
            {
                id: 'institutionName',
                key: 'institutionName',
                label: 'Institution Name',
                type: 'text',
                placeholder: 'Enter your institution name',
                required: true
            },
            {
                id: 'maxLoanAmount',
                key: 'maxLoanAmount',
                label: 'Maximum Loan Amount',
                type: 'number',
                placeholder: 'Enter maximum loan amount',
                required: true
            }
        ]
    } else if (formType === 'supervisor') {
        return [
            ...baseFields,
            {
                id: 'supervisorLicenseNumber',
                key: 'supervisorLicenseNumber',
                label: 'Supervisor License Number',
                type: 'text',
                placeholder: 'Enter your supervisor license number',    
                required: true
            },
            {
                id: 'supervisorRole',
                key: 'supervisorRole',
                label: 'Supervisor Role',
                type: 'text',
                placeholder: 'Enter your admin role',
                required: true
            }
        ]
    } else if (formType === 'partner') {
        return [
            ...baseFields,
            {
                id: 'partnerLicenseNumber',
                key: 'partnerLicenseNumber',
                label: 'Partner License Number',
                type: 'text',
                placeholder: 'Enter your partner license number',
                required: true
            }
        ]
    } else if (formType === 'admin') {
        return [
            ...baseFields,
            {
                id: 'adminLicenseNumber',
                key: 'adminLicenseNumber',
                label: 'Admin License Number',
                type: 'text',
                placeholder: 'Enter your admin license number',
                required: true
            }
        ]
    }
    return baseFields
}

// Define document requirements for each onboarding type
const getDocumentRequirements = (formType: string): DocumentRequirement[] => {
    const commonDocs: DocumentRequirement[] = [
        {
            id: 'idDocument',
            label: 'Government ID',
            description: 'Upload a valid government-issued ID (Driver\'s License, Passport, etc.)',
            required: true,
            acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
            maxSize: 5 * 1024 * 1024 // 5MB
        }
    ]
    
    if (formType === 'agent') {
        return [
            ...commonDocs,
            {
                id: 'licenseDocument',
                label: 'Real Estate License',
                description: 'Upload your real estate license document',
                required: true,
                acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
                maxSize: 5 * 1024 * 1024 // 5MB
            },
            {
                id: 'backgroundCheck',
                label: 'Background Check',
                description: 'Upload background check document',
                required: false,
                acceptedTypes: ['application/pdf'],
                maxSize: 5 * 1024 * 1024 // 5MB
            }
        ]
    } else if (formType === 'borrower') {
        return [
            ...commonDocs,
            {
                id: 'proofOfIncome',
                label: 'Proof of Income',
                description: 'Upload proof of income (pay stubs, bank statements, etc.)',
                required: true,
                acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
                maxSize: 10 * 1024 * 1024 // 10MB
            },
            {
                id: 'creditReport',
                label: 'Credit Report',
                description: 'Upload your credit report (optional)',
                required: false,
                acceptedTypes: ['application/pdf'],
                maxSize: 5 * 1024 * 1024 // 5MB
            }
        ]
    } else if (formType === 'lender') {
        return [
            ...commonDocs,
            {
                id: 'businessLicense',
                label: 'Business License',
                description: 'Upload your business license',
                required: true,
                acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
                maxSize: 5 * 1024 * 1024 // 5MB
            },
            {
                id: 'financialStatement',
                label: 'Financial Statement',
                description: 'Upload financial statement or proof of capital',
                required: true,
                acceptedTypes: ['application/pdf'],
                maxSize: 10 * 1024 * 1024 // 10MB
            }
        ]
    }
    
    return commonDocs
}




// Handle form submission
// TODO: Replace with actual API call when database is connected
const handleFormSubmit = async (submission: OnboardingSubmission): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form submission:', submission)
    
    // TODO: Replace with actual API call
    // Example:
    // const formData = new FormData()
    // 
    // // Add form data
    // Object.entries(submission.formData).forEach(([key, value]) => {
    //     formData.append(key, String(value))
    // })
    // 
    // // Add documents
    // submission.documents.forEach((doc, index) => {
    //     formData.append(`document_${index}`, doc.file)
    //     formData.append(`document_${index}_name`, doc.name)
    //     formData.append(`document_${index}_type`, doc.id)
    // })
    // 
    // const response = await fetch('/api/onboarding/submit', {
    //     method: 'POST',
    //     body: formData
    // })
    // 
    // if (response.ok) {
    //     // Update verification state via injected state
    //     // verificationState.updateSubmitted(submission.formType)
    //     return true
    // }
    // return false
    
    // Update in-memory verification state
    if (verificationState) {
        verificationState.updateSubmitted(submission.formType)
        
        // Automatically update test user via API
        if (verificationState.currentUserPhone.value) {
            try {
                const { updateTestUser } = await import('../src/config/testUsers')
                await updateTestUser(verificationState.currentUserPhone.value, {
                    submittedFormType: submission.formType,
                    verified: false
                })
                console.log('✓ Test user updated via API')
            } catch (error) {
                console.warn('Error updating test user via API (non-critical):', error)
                // Non-critical - continue with form submission
            }
        }
    }
    refreshKey.value++ // Trigger UI update
    return true
}
</script>

<style scoped>

</style>