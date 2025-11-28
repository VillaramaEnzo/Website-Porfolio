// Form storage service - currently uses localStorage, ready to be replaced with backend API

import type { OnboardingFormData } from '../types/onboarding'

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

// Note: Files cannot be stored in localStorage, so we only save metadata
// Users will need to re-upload files when continuing (or use IndexedDB for full file storage)

const STORAGE_PREFIX = 'tango_saved_form_'

export const formStorage = {
  /**
   * Save form progress to localStorage
   * Note: Files are not saved, only metadata (name, size, type)
   */
  saveForm(formType: 'agent' | 'borrower' | 'lender', formData: OnboardingFormData, documentMetadata: Record<string, Array<{ name: string; size: number; type: string }>>): void {
    const savedData: SavedFormData = {
      formType,
      formData: { ...formData },
      documentMetadata: { ...documentMetadata },
      savedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
    
    const key = `${STORAGE_PREFIX}${formType}`
    localStorage.setItem(key, JSON.stringify(savedData))
  },

  /**
   * Get saved form data for a specific form type
   */
  getSavedForm(formType: 'agent' | 'borrower' | 'lender'): SavedFormData | null {
    const key = `${STORAGE_PREFIX}${formType}`
    const saved = localStorage.getItem(key)
    
    if (!saved) {
      return null
    }
    
    try {
      return JSON.parse(saved) as SavedFormData
    } catch (error) {
      console.error('Error parsing saved form data:', error)
      return null
    }
  },

  /**
   * Check if a saved form exists for a form type
   */
  hasSavedForm(formType: 'agent' | 'borrower' | 'lender'): boolean {
    return this.getSavedForm(formType) !== null
  },

  /**
   * Delete saved form for a specific form type
   */
  deleteSavedForm(formType: 'agent' | 'borrower' | 'lender'): void {
    const key = `${STORAGE_PREFIX}${formType}`
    localStorage.removeItem(key)
  },

  /**
   * Update last modified timestamp
   */
  updateLastModified(formType: 'agent' | 'borrower' | 'lender'): void {
    const saved = this.getSavedForm(formType)
    if (saved) {
      saved.lastModified = new Date().toISOString()
      const key = `${STORAGE_PREFIX}${formType}`
      localStorage.setItem(key, JSON.stringify(saved))
    }
  },

  /**
   * Get all saved forms (for debugging/admin purposes)
   */
  getAllSavedForms(): Record<string, SavedFormData> {
    const forms: Record<string, SavedFormData> = {}
    const formTypes: Array<'agent' | 'borrower' | 'lender'> = ['agent', 'borrower', 'lender']
    
    formTypes.forEach(type => {
      const saved = this.getSavedForm(type)
      if (saved) {
        forms[type] = saved
      }
    })
    
    return forms
  }
}

// TODO: When backend is ready, replace localStorage calls with API calls:
// Example:
// export const formStorage = {
//   async saveForm(...) {
//     await fetch('/api/forms/save', { method: 'POST', body: JSON.stringify(...) })
//   },
//   async getSavedForm(...) {
//     const response = await fetch(`/api/forms/saved/${formType}`)
//     return await response.json()
//   },
//   ...
// }

