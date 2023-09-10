<script setup>
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import { convertToE164 } from '~/utilities/helpers.js'
import { useToast } from 'primevue/usetoast'
const toast = useToast()
//const gtm = useGtm()
// function triggerEvent() {
// 	gtm.trackEvent({
// 		event: 'login',
// 		category: 'GTM Test',
// 		action: 'click',
// 		label: 'Login',
// 		value: 5000,
// 		noninteraction: false,
// 	})
// }

// function triggerView() {
// 	gtm.trackView('Home', '/')
// }
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
      console.log('error', error)
      // message alert to user
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
  const user = await client.auth.getSession()
  console.log(user)
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
      <InputText v-model="verifyCode" />
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
