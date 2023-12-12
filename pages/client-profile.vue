<script setup>
import { useVuelidate } from "@vuelidate/core"
import { useToast } from "primevue/usetoast"
import { useCurrentUser, useCurrentUserProfile } from "~/composables/states"

definePageMeta({
  middleware: "get-profile",
})

const route = useRoute()
const isEditing = route.query.edit === "true"
const currentUser = useCurrentUser()
const currentUserProfile = useCurrentUserProfile()
const toast = useToast()
const client = useSupabaseClient()

const rules = computed(() => {
  return {
    first_name: validateRequired("First name is required"),
    last_name: validateRequired("Last name is required"),
    email: validateEmail(),
  }
})
//console.log("currentUser = ", currentUser)
const formData = reactive({
  first_name: currentUserProfile.value?.first_name ?? "",
  last_name: currentUserProfile.value?.last_name ?? "",
  email: currentUserProfile.value?.email ?? "",
})

const v$ = useVuelidate(rules, formData)

async function submit() {
  v$.value.$validate()
  if (!v$.value.$error) {
    // No validation error, save to Supabase
    currentUser.value = await client.auth.getSession()
    const currentPhone = formatPhoneNumber(currentUser.value.data.session.user.phone)
    //console.log(currentUser.value)
    const sb1 = await client
      .from("profiles")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentUser.value.data.session.user.id)

    //   If Supabase errors
    if (sb1?.error) {
      toast.add(toastMessage("database_error"))
    } else {
      toast.add(toastMessage("profile_saved"))
      if (isEditing) {
        navigateTo("/dashboard")
      } else {
        navigateTo("/pet-profile")
      }
    }
  } else {
    scrollToFirstValidationError()
  }
}

watch(
  () => currentUserProfile.value,
  () => {
    //console.log("currentUserProfile.value", currentUserProfile.value)
    formData.first_name = currentUserProfile.value?.first_name ?? ""
    formData.last_name = currentUserProfile.value?.last_name ?? ""
    formData.email = currentUserProfile.value?.email ?? ""
  }
)
</script>
<template>
  <section>
    <Button
      v-if="isEditing"
      class="flex-none"
      icon="pi pi-chevron-left"
      rounded
      @click="navigateTo('/dashboard')"
    />
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
      <div v-if="isEditing" class="flex align-items-center gap-2 mt-2">
        <label for="email">Phone</label>
        <Button
          plain
          label="Change phone number"
          size="small"
          @click="navigateTo('/change-phone')"
        />
      </div>
      <div class="mt-6">
        <Button type="submit" :label="isEditing ? 'Update Profile' : 'Save Profile'" />
      </div>
    </form>
  </section>
</template>
