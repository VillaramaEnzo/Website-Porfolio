<template>
    <div class="mb-3">
        <label :for="fieldId" class="form-label">
            {{ label }}
            <span v-if="required" class="text-danger">*</span>
        </label>
        <input
            :id="fieldId"
            type="file"
            class="form-control"
            :accept="acceptedTypes.join(',')"
            :required="required && !hasFile"
            :multiple="multiple"
            @change="handleFileChange"
        />
        <small class="form-text text-muted" v-if="description">
            {{ description }}
        </small>
        <small class="form-text text-muted">
            Accepted: {{ acceptedTypesDisplay }} | Max size: {{ maxSizeDisplay }}
        </small>
        
        <!-- File Preview/List -->
        <div v-if="uploadedFiles.length > 0" class="mt-2">
            <div 
                v-for="(file, index) in uploadedFiles" 
                :key="index"
                class="d-flex align-items-center justify-content-between border rounded p-2 mb-2"
            >
                <div class="d-flex align-items-center">
                    <span class="me-2">📄</span>
                    <div>
                        <div class="fw-bold">{{ file.name }}</div>
                        <small class="text-muted">{{ formatFileSize(file.size) }}</small>
                    </div>
                </div>
                <button 
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    @click="removeFile(index)"
                >
                    Remove
                </button>
            </div>
        </div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-danger mt-2 mb-0" role="alert">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
    fieldId: string
    label: string
    description?: string
    required?: boolean
    acceptedTypes: string[]
    maxSize: number // in bytes
    multiple?: boolean
    modelValue?: File[]
}

const props = withDefaults(defineProps<Props>(), {
    required: false,
    multiple: false,
    modelValue: () => []
})

const emit = defineEmits<{
    'update:modelValue': [files: File[]]
}>()

const uploadedFiles = ref<File[]>(props.modelValue || [])
const errorMessage = ref('')

const hasFile = computed(() => uploadedFiles.value.length > 0)

const acceptedTypesDisplay = computed(() => {
    return props.acceptedTypes.map(type => {
        if (type.startsWith('image/')) return type.split('/')[1].toUpperCase()
        if (type.startsWith('application/')) {
            if (type.includes('pdf')) return 'PDF'
            return type.split('/')[1].toUpperCase()
        }
        return type
    }).join(', ')
})

const maxSizeDisplay = computed(() => {
    return formatFileSize(props.maxSize)
})

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const validateFile = (file: File): boolean => {
    // Check file type
    if (!props.acceptedTypes.includes(file.type)) {
        errorMessage.value = `File type not allowed. Accepted types: ${acceptedTypesDisplay.value}`
        return false
    }
    
    // Check file size
    if (file.size > props.maxSize) {
        errorMessage.value = `File size exceeds maximum of ${maxSizeDisplay.value}`
        return false
    }
    
    errorMessage.value = ''
    return true
}

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files
    
    if (!files || files.length === 0) {
        return
    }
    
    errorMessage.value = ''
    
    // Validate all files
    const validFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (validateFile(file)) {
            validFiles.push(file)
        } else {
            // Clear the input if validation fails
            target.value = ''
            return
        }
    }
    
    if (props.multiple) {
        uploadedFiles.value = [...uploadedFiles.value, ...validFiles]
    } else {
        uploadedFiles.value = validFiles
    }
    
    emit('update:modelValue', uploadedFiles.value)
}

const removeFile = (index: number) => {
    uploadedFiles.value.splice(index, 1)
    emit('update:modelValue', uploadedFiles.value)
}
</script>

<style scoped>
.border {
    background-color: #f8f9fa;
}
</style>

