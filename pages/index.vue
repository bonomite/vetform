<script setup>
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import { convertToE164 } from '~/utilities/helpers.js'
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
      isSmsSent.value = true
      // if no error route to verify page
    }
  } else {
    //alert('not valid')
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
  <h2>Let's sign in with your phone number</h2>

  <div v-if="!isSmsSent">
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
    </div>
  </div>
</template>
