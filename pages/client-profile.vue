<script setup>
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast'
import { useCurrentUser, useCurrentUserProfile } from '~/composables/states.ts'
definePageMeta({
  middleware: 'get-profile',
})

const currentUser = useCurrentUser()
const currentUserProfile = useCurrentUserProfile()
const toast = useToast()
const client = useSupabaseClient()

const rules = computed(() => {
  return {
    first_name: {
      required: helpers.withMessage('First name is required', required),
    },
    last_name: {
      required: helpers.withMessage('Last name is required', required),
    },
    email: {
      email: helpers.withMessage('Invalid email format', email),
      required: helpers.withMessage('The email field is required', required),
    },
  }
})

console.log('useCurrentUserProfile -----', currentUserProfile.value)

const formData = reactive({
  first_name: currentUserProfile.value?.first_name ?? '',
  last_name: currentUserProfile.value?.last_name ?? '',
  email: currentUserProfile.value?.email ?? '',
})

const v$ = useVuelidate(rules, formData)

async function submit() {
  v$.value.$validate()
  if (!v$.value.$error) {
    // No validation error, save to Supabase
    currentUser.value = await client.auth.getSession()
    console.log(currentUser.value)
    const { error } = await client
      .from('profiles')
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentUser.value.data.session.user.id)
    //   If Supabase errors
    if (error) {
      toast.add({
        severity: 'danger',
        summary: 'Database error',
        detail: `An error occured, please try again.`,
        life: 3000,
      })
    } else {
      toast.add({
        severity: 'success',
        summary: 'Profile saved',
        detail: `Your profile information has been saved.`,
        life: 3000,
      })
      navigateTo('/pet-profile')
    }
  }
}

watch(
  () => currentUserProfile.value,
  () => {
    formData.first_name = currentUserProfile.value?.first_name ?? ''
    formData.last_name = currentUserProfile.value?.last_name ?? ''
    formData.email = currentUserProfile.value?.email ?? ''
  }
)
</script>
<template>
  <h1>Client Profile</h1>

  <form novalidate @submit.prevent="submit" class="flex flex-column gap-2">
    <div class="flex flex-column gap-2">
      <label for="first_name">First Name</label>
      <InputText
        label="First Name"
        v-model="formData.first_name"
        :class="{ 'p-invalid': v$.first_name.$error && v$.first_name.$invalid }"
      ></InputText>
      <Error :errArr="v$.first_name.$errors" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="last_name">Last Name</label>
      <InputText
        v-model="formData.last_name"
        :class="{ 'p-invalid': v$.last_name.$error && v$.last_name.$invalid }"
      ></InputText>
      <Error :errArr="v$.last_name.$errors" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="email">Email</label>
      <InputText
        label="Email"
        v-model="formData.email"
        :class="{ 'p-invalid': v$.email.$error && v$.email.$invalid }"
      ></InputText>
      <Error :errArr="v$.email.$errors" />
    </div>
    <div>
      <Button type="submit" label="Save Profile" />
    </div>
  </form>
</template>
