// Onboarding form types - ready for database integration

export interface DocumentUpload {
  id: string
  name: string
  file: File
  preview?: string
  uploaded?: boolean
  uploadProgress?: number
}

export interface OnboardingFormData {
  [key: string]: string | number | File[] | DocumentUpload[]
}

export interface OnboardingSubmission {
  formType: 'agent' | 'borrower' | 'lender'
  formData: OnboardingFormData
  documents: DocumentUpload[]
  submittedAt?: Date
}

// Document requirements for each form type
export interface DocumentRequirement {
  id: string
  label: string
  description?: string
  required: boolean
  acceptedTypes: string[] // e.g., ['image/jpeg', 'image/png', 'application/pdf']
  maxSize: number // in bytes
}

// Saved form data structure
export interface SavedFormData {
  formType: 'agent' | 'borrower' | 'lender'
  formData: OnboardingFormData
  documentMetadata: Record<string, Array<{
    name: string
    size: number
    type: string
  }>>
  savedAt: string
  lastModified: string
}

