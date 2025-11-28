<template>
    <div class="container d-flex justify-content-center align-items-center" style="min-height: 100vh;">
        <div class="card" style="width: 100%; max-width: 450px;">
            <div class="card-body p-4">
                <h2 class="card-title text-center mb-4">It Takes Two To Tango</h2>
                
                <form @submit.prevent="handleSignUp">
                    <div 
                        v-for="field in formFields" 
                        :key="field.id" 
                        class="mb-3"
                    >
                        <label :for="field.id" class="form-label">{{ field.label }}</label>
                        <input
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
                    <div v-if="errorMessage" class="alert alert-danger" role="alert">
                        {{ errorMessage }}
                    </div>
                    <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {{ isLoading ? 'Creating account...' : 'Create Account' }}
                    </button>
                    <div class="text-center">
                        <p class="mb-0">Already have an account? 
                            <a href="#" @click.prevent="$emit('switchToLogin')" class="text-decoration-none">Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { SignUpData } from '../src/types/auth'

type FormDataKey = keyof SignUpData | 'confirmPassword'

interface FormField {
    id: string
    key: FormDataKey
    label: string
    type: string
    placeholder: string
    required?: boolean
    pattern?: string
    minlength?: number
}

interface FormData extends SignUpData {
    confirmPassword?: string
}

interface Props {
    onSignUp: (data: SignUpData) => Promise<boolean> | boolean
}

const props = defineProps<Props>()
defineEmits<{
    switchToLogin: []
}>()

const formFields: FormField[] = [
    {
        id: 'firstName',
        key: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter first name',
        required: true
    },
    {
        id: 'lastName',
        key: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter last name',
        required: true
    },
    {
        id: 'email',
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter email address',
        required: true
    },
    {
        id: 'phoneNumber',
        key: 'phoneNumber',
        label: 'Phone Number',
        type: 'tel',
        placeholder: 'Enter phone number',
        required: true,
        pattern: '[0-9+\\-\\s()]+'
    },
    {
        id: 'password',
        key: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Create password',
        required: true,
        minlength: 6
    },
    {
        id: 'confirmPassword',
        key: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Confirm password',
        required: true,
        minlength: 6
    }
]

const formData = reactive<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
})

const errorMessage = ref('')
const isLoading = ref(false)

const validateForm = (): boolean => {
    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
        errorMessage.value = 'Please fill in all required fields'
        return false
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
        errorMessage.value = 'Please enter a valid email address'
        return false
    }
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
        errorMessage.value = 'Passwords do not match'
        return false
    }
    
    // Validate password length
    if (formData.password.length < 6) {
        errorMessage.value = 'Password must be at least 6 characters'
        return false
    }
    
    return true
}

const handleSignUp = async () => {
    errorMessage.value = ''
    
    if (!validateForm()) {
        return
    }
    
    isLoading.value = true
    
    try {
        const signUpData: SignUpData = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            password: formData.password
        }
        
        // Call the parent's signup handler (can be replaced with API call)
        const success = await props.onSignUp(signUpData)
        
        if (!success) {
            errorMessage.value = 'Account creation failed. Please try again.'
            isLoading.value = false
        } else {
            // Success - parent component will handle navigation
            // Clear form
            formData.firstName = ''
            formData.lastName = ''
            formData.email = ''
            formData.phoneNumber = ''
            formData.password = ''
            formData.confirmPassword = ''
            errorMessage.value = ''
            isLoading.value = false
        }
    } catch (error) {
        errorMessage.value = 'An error occurred. Please try again.'
        isLoading.value = false
        console.error('Signup error:', error)
    }
}
</script>

<style scoped>
.card {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>

