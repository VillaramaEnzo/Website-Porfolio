<template>
    <div class="mt-4" style="max-width: 800px; margin: 0 auto;">
        <button class="btn btn-secondary mb-3" @click="$emit('goBack')">
            ← Back to Form Selection
        </button>
        
        <h1 class="mb-4">{{ formTitle }}</h1>
        
        <form @submit.prevent="handleSubmit">
            <!-- Dynamic Form Fields -->
            <div 
                v-for="field in formFields" 
                :key="field.id" 
                class="mb-3"
            >
                <label :for="field.id" class="form-label">
                    {{ field.label }}
                    <span v-if="field.required" class="text-danger">*</span>
                </label>
                <input
                    v-if="field.type !== 'file'"
                    :type="field.type"
                    class="form-control"
                    :id="field.id"
                    v-model="formData[field.key]"
                    :required="field.required"
                    :placeholder="field.placeholder"
                    :pattern="field.pattern"
                    :minlength="field.minlength"
                />
            </div>
            
            <!-- Document Upload Fields -->
            <FileUpload
                v-for="docReq in documentRequirements"
                :key="docReq.id"
                :field-id="docReq.id"
                :label="docReq.label"
                :description="docReq.description"
                :required="docReq.required"
                :accepted-types="docReq.acceptedTypes"
                :max-size="docReq.maxSize"
                :multiple="false"
                v-model="documents[docReq.id]"
            />
            
            <!-- Error Message -->
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>
            
            <!-- Success Message -->
            <div v-if="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
            </div>
            
            <!-- Save Progress Message -->
            <div v-if="saveMessage" class="alert alert-info mt-3 mb-0" role="alert">
                {{ saveMessage }}
            </div>
            
            <!-- Submit Button -->
            <div class="d-flex gap-2 mt-4 flex-wrap">
                <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="isSubmitting"
                >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isSubmitting ? 'Submitting...' : 'Submit Onboarding Form' }}
                </button>
                <button 
                    type="button" 
                    class="btn btn-outline-primary"
                    @click="saveProgress"
                    :disabled="isSubmitting"
                >
                    💾 Save Progress
                </button>
                <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="resetForm"
                    :disabled="isSubmitting"
                >
                    Reset Form
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import FileUpload from './FileUpload.vue'
import { formStorage } from '../src/services/formStorage'
import type { OnboardingFormData, DocumentRequirement, OnboardingSubmission } from '../src/types/onboarding'

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

interface Props {
    formType: 'agent' | 'borrower' | 'lender'
    formTitle: string
    formFields: FormField[]
    documentRequirements: DocumentRequirement[]
    onSubmit: (submission: OnboardingSubmission) => Promise<boolean> | boolean
    loadSavedData?: boolean // Whether to load saved data on mount
}

const props = withDefaults(defineProps<Props>(), {
    loadSavedData: false
})

defineEmits<{
    goBack: []
}>()

const formData = reactive<OnboardingFormData>({})
const documents = reactive<Record<string, File[]>>({})
const errorMessage = ref('')
const successMessage = ref('')
const saveMessage = ref('')
const isSubmitting = ref(false)

// Initialize form data from formFields
props.formFields.forEach(field => {
    formData[field.key] = ''
})

// Initialize documents object
props.documentRequirements.forEach(docReq => {
    documents[docReq.id] = []
})

// Load saved form data if requested
onMounted(() => {
    if (props.loadSavedData) {
        loadSavedForm()
    }
})

const loadSavedForm = () => {
    const saved = formStorage.getSavedForm(props.formType)
    if (saved) {
        // Load form data
        Object.keys(saved.formData).forEach(key => {
            if (formData.hasOwnProperty(key)) {
                formData[key] = saved.formData[key]
            }
        })
        
        // Note: Files cannot be restored from localStorage
        // Document metadata is saved but files need to be re-uploaded
        if (Object.keys(saved.documentMetadata).length > 0) {
            saveMessage.value = 'Form data loaded. Note: Files need to be re-uploaded as they cannot be saved locally.'
        } else {
            saveMessage.value = 'Saved form data loaded successfully.'
        }
        
        // Clear message after 5 seconds
        setTimeout(() => {
            saveMessage.value = ''
        }, 5000)
    }
}

const saveProgress = () => {
    // Prepare document metadata (files can't be saved to localStorage)
    const documentMetadata: Record<string, Array<{ name: string; size: number; type: string }>> = {}
    
    props.documentRequirements.forEach(docReq => {
        if (documents[docReq.id] && documents[docReq.id].length > 0) {
            documentMetadata[docReq.id] = documents[docReq.id].map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            }))
        }
    })
    
    // Save to storage
    formStorage.saveForm(props.formType, formData, documentMetadata)
    
    saveMessage.value = 'Progress saved successfully! You can continue later.'
    setTimeout(() => {
        saveMessage.value = ''
    }, 3000)
}

const validateForm = (): boolean => {
    errorMessage.value = ''
    
    // Validate form fields
    for (const field of props.formFields) {
        if (field.required && !formData[field.key]) {
            errorMessage.value = `Please fill in ${field.label}`
            return false
        }
    }
    
    // Validate required documents
    for (const docReq of props.documentRequirements) {
        if (docReq.required && (!documents[docReq.id] || documents[docReq.id].length === 0)) {
            errorMessage.value = `Please upload ${docReq.label}`
            return false
        }
    }
    
    return true
}

const handleSubmit = async () => {
    if (!validateForm()) {
        return
    }
    
    isSubmitting.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    try {
        // Prepare document uploads
        const documentUploads = props.documentRequirements
            .filter(docReq => documents[docReq.id] && documents[docReq.id].length > 0)
            .flatMap(docReq => 
                documents[docReq.id].map(file => ({
                    id: docReq.id,
                    name: file.name,
                    file: file
                }))
            )
        
        const submission: OnboardingSubmission = {
            formType: props.formType,
            formData: { ...formData },
            documents: documentUploads,
            submittedAt: new Date()
        }
        
        // Call the parent's submit handler
        const success = await props.onSubmit(submission)
        
        if (success) {
            successMessage.value = 'Form submitted successfully!'
            // Clear saved form after successful submission
            formStorage.deleteSavedForm(props.formType)
            // Optionally reset form after successful submission
            // resetForm()
        } else {
            errorMessage.value = 'Form submission failed. Please try again.'
        }
    } catch (error) {
        errorMessage.value = 'An error occurred while submitting the form. Please try again.'
        console.error('Form submission error:', error)
    } finally {
        isSubmitting.value = false
    }
}

const resetForm = () => {
    // Confirm before resetting if there's saved data
    const hasSaved = formStorage.hasSavedForm(props.formType)
    
    if (hasSaved) {
        const confirmed = confirm('This will clear your current progress. Do you want to also delete your saved form?')
        if (confirmed) {
            formStorage.deleteSavedForm(props.formType)
        }
    }
    
    // Reset form data
    props.formFields.forEach(field => {
        formData[field.key] = ''
    })
    
    // Reset documents
    props.documentRequirements.forEach(docReq => {
        documents[docReq.id] = []
    })
    
    errorMessage.value = ''
    successMessage.value = ''
    saveMessage.value = ''
}
</script>

<style scoped>
.gap-2 {
    gap: 0.5rem;
}
</style>

