<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <h1 class="mb-4">{{ dashboardTitle }}</h1>
                
                <div class="alert alert-success" role="alert">
                    <h4 class="alert-heading">✓ Verification Complete!</h4>
                    <p>Your {{ formType }} onboarding has been verified. Welcome to your dashboard!</p>
                </div>
                
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Dashboard Content</h5>
                        <p class="card-text">
                            This is your {{ formType }} dashboard. 
                            Customize this section based on the user's verification type.
                        </p>
                        
                        <!-- Placeholder content - customize based on form type -->
                        <div v-if="formType === 'agent'" class="mt-3">
                            <h6>Agent Features:</h6>
                            <ul>
                                <li>Manage listings</li>
                                <li>View client information</li>
                                <li>Track transactions</li>
                            </ul>
                        </div>
                        
                        <div v-else-if="formType === 'borrower'" class="mt-3">
                            <h6>Borrower Features:</h6>
                            <ul>
                                <li>View loan applications</li>
                                <li>Check loan status</li>
                                <li>Manage documents</li>
                            </ul>
                        </div>
                        
                        <div v-else-if="formType === 'lender'" class="mt-3">
                            <h6>Lender Features:</h6>
                            <ul>
                                <li>Review loan applications</li>
                                <li>Manage borrowers</li>
                                <li>Financial reports</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FormType } from '../src/types/formTypes'

interface Props {
    formType: FormType
}

const props = defineProps<Props>()

const dashboardTitle = computed(() => {
    const titles = {
        agent: 'Agent Dashboard',
        borrower: 'Borrower Dashboard',
        lender: 'Lender Dashboard'
    }
    return titles[props.formType]
})
</script>

<style scoped>
.card {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>

