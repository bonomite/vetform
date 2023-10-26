<script setup>
import { useVuelidate } from '@vuelidate/core'
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
    first_name: validateRequired('First name is required'),
    last_name: validateRequired('Last name is required'),
    email: validateEmail(),
  }
})

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
    //console.log(currentUser.value)
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
      toast.add(toastMessage('database_error'))
    } else {
      toast.add(toastMessage('profile_saved'))
      navigateTo('/pet-profile')
    }
  } else {
    scrollToFirstValidationError()
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
  <section>
    <h1>Client Profile</h1>

    <form novalidate @submit.prevent="submit" class="flex flex-column gap-2">
      <div class="flex flex-column gap-2">
        <label for="first_name">First Name</label>
        <InputText
          label="First Name"
          v-model="formData.first_name"
          :class="{
            'p-invalid': v$.first_name.$error && v$.first_name.$invalid,
          }"
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
  </section>
</template>
