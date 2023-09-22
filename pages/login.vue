<script setup>
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { convertToE164 } from '~/utilities/helpers.js'
import { useToast } from 'primevue/usetoast'
import { useCurrentUser } from '~/composables/states.ts'
const currentUser = useCurrentUser()
const toast = useToast()
const client = useSupabaseClient()
const phoneNumberRegEx = helpers.regex(/^\(\d{3}\) \d{3}-\d{4}$/)
const rules = computed(() => {
  return {
    phone: {
      required: helpers.withMessage(
        'The phone number field is required',
        required
      ),
      phoneNumberRegEx,
    },
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
  //console.log(v$.value)
  if (!v$.value.$error) {
    //alert('valid')
    // GTM event here
    // supabase auth check here
    console.log('convertToE164(formData.phone)', convertToE164(formData.phone))
    let { user, error } = await client.auth.signInWithOtp({
      phone: convertToE164(formData.phone),
    })

    console.log('user', user)

    if (error) {
      // Error with Supabase
      console.log('error', error)
      toast.add({
        severity: 'danger',
        summary: 'Database Error',
        detail: `An error occured, please try again.`,
        life: 3000,
      })
    } else {
      // if no error show the verify code input
      isSmsSent.value = true
      toast.add({
        severity: 'success',
        summary: 'Authentication',
        detail: `Verification code sent to ${formData.phone}`,
        life: 3000,
      })
    }
  } else {
    //alert('not valid')
    toast.add({
      severity: 'danger',
      summary: 'Authentication failed',
      detail: `Please enter a valid phone number and try again`,
      life: 3000,
    })
  }
}

async function verify() {
  let { session, error } = await client.auth.verifyOtp({
    phone: convertToE164(formData.phone),
    token: verifyCode.value,
    type: 'sms',
  })
  if (error) {
    toast.add({
      severity: 'danger',
      summary: 'Verification failed',
      detail: `Code verification failed. Please try again.`,
      life: 3000,
    })
  } else {
    currentUser.value = await client.auth.getSession()
    if (currentUser.value.data.session.user.email) {
      // Previously logged in
      navigateTo('/dashboard')
    } else {
      navigateTo('/client-profile')
      // New user
    }
    console.log(session)
    console.log(currentUser)
  }
}
</script>
<template>
  <h1>Welcome to VCA Animal Hospital</h1>
  <div v-if="!isSmsSent">
    <h2>Let's sign in with your phone number</h2>
    <div class="flex flex-column">
      <label for="phone">Phone</label>
      <InputMask
        v-model="formData.phone"
        date="phone"
        mask="(999) 999-9999"
        placeholder="(999) 999-9999"
      />
      <error :errArr="v$.phone.$errors" />

      <Button label="Continue" @click="phoneAuth" />
    </div>
  </div>
  <div v-else>
    <div class="flex flex-column">
      <label for="phone"
        >Enter your verification code sent to your phone number</label
      >
      <InputText v-model="verifyCode" autofocus />
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
</template>
