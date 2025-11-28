<template>
    <div class="container d-flex justify-content-center align-items-center" style="min-height: 100vh;">
        <div class="card" style="width: 100%; max-width: 400px;">
            <div class="card-body p-4">
                <h2 class="card-title text-center mb-4">Let's Tango!</h2>
                
                <form @submit.prevent="handleLogin">
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
                        {{ isLoading ? 'Logging in...' : 'Login' }}
                    </button>
                    <div class="text-center">
                        <p class="mb-0">Don't have an account? 
                            <a href="#" @click.prevent="$emit('switchToSignup')" class="text-decoration-none">Create one</a>
                        </p>
                        <small class="text-muted d-block mt-2">
                            <strong>Test Users:</strong> See TEST_USERS.md for credentials
                        </small>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { LoginCredentials } from '../src/types/auth'

interface FormField {
    id: string
    key: keyof LoginCredentials
    label: string
    type: string
    placeholder: string
    required?: boolean
    pattern?: string
    minlength?: number
}

interface Props {
    onLogin: (credentials: LoginCredentials) => Promise<boolean> | boolean
}

const props = defineProps<Props>()
defineEmits<{
    switchToSignup: []
}>()

const formFields: FormField[] = [
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
        placeholder: 'Enter password',
        required: true
    }
]

const formData = reactive<LoginCredentials>({
    phoneNumber: '',
    password: ''
})

const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
    errorMessage.value = ''
    isLoading.value = true
    
    try {
        const credentials: LoginCredentials = {
            phoneNumber: formData.phoneNumber.trim(),
            password: formData.password
        }
        
        // Call the parent's login handler (can be replaced with API call)
        const success = await props.onLogin(credentials)
        
        if (!success) {
            errorMessage.value = 'Invalid phone number or password'
            isLoading.value = false
        }
        // If successful, the parent component will handle the state change
    } catch (error) {
        errorMessage.value = 'An error occurred. Please try again.'
        isLoading.value = false
        console.error('Login error:', error)
    }
}
</script>

<style scoped>
.card {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>

