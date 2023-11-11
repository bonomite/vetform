<script setup>
import { useVuelidate } from '@vuelidate/core'
import { useToast } from 'primevue/usetoast'
import { useCurrentUser } from '~/composables/states.ts'

const toast = useToast()
const currentUser = useCurrentUser()
const client = useSupabaseClient()
console.log('client', client)
const rules = computed(() => {
  return {
    phone: validatePhone(),
  }
})
const formData = reactive({
  phone: '',
})
const isSmsSent = ref(false)
const verifyCode = ref(null)
const v$ = useVuelidate(rules, formData)

async function phoneAuth() {
  v$.value.$validate()
  if (!v$.value.$error) {
    console.log('WHY')
    let { user, error } = await client.auth.signInWithOtp({
      phone: convertPhoneToE164(formData.phone),
    })

    console.log('user', user)

    if (error) {
      // Error with Supabase
      //console.log('error', error)
      toast.add(toastMessage('database_error'))
    } else {
      // if no error show the verify code input
      isSmsSent.value = true
      toast.add(toastMessage('sms_code_sent', formData.phone))
    }
  } else {
    toast.add(toastMessage('phone_auth_failed'))
  }
}

async function verify() {
  let { session, error } = await client.auth.verifyOtp({
    phone: convertPhoneToE164(formData.phone),
    token: verifyCode.value,
    type: 'sms',
  })
  if (error) {
    toast.add(toastMessage('sms_code_failed'))
  } else {
    currentUser.value = await client.auth.getSession()
    if (currentUser.value.data.session.user.email) {
      // Previously logged in
      navigateTo('/dashboard')
    } else {
      navigateTo('/client-profile')
      // New user
    }
    //console.log(session)
    //console.log(currentUser)
  }
}
</script>
<template>
  <section>
    <h1>Welcome to { NAME } Animal Hospital</h1>
    <div v-if="!isSmsSent">
      <h2>Let's sign in with your phone number</h2>
      <div class="flex flex-column">
        <label for="phone">Phone</label>
        <InputMask
          v-model="formData.phone"
          date="phone"
          mask="(999) 999-9999"
          placeholder="(999) 999-9999"
          @keydown="(e) => (e.key === 'Enter' ? phoneAuth() : null)"
          autofocus
        />
        <error :errArr="v$.phone.$errors" />

        <Button label="Continue" @click="phoneAuth" />
      </div>
    </div>
    <div v-else>
      <div class="flex flex-column">
        <label for="phone">Enter your verification code sent to your phone number</label>
        <InputText v-model="verifyCode" autofocus @keydown="(e) => (e.key === 'Enter' ? verify() : null)" />
        <Button label="Verify" @click="verify" />
        <Button link label="Resend Code" @click="phoneAuth" />
        <Button
          link
          label="Use a different phone number"
          @click="
            () => {
              isSmsSent = !isSmsSent
            }
          "
        />
      </div>
    </div>
  </section>
</template>
