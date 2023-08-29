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

const v$ = useVuelidate(rules, formData)

async function verify() {
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
      // if no error route to verify page
    }
  } else {
    //alert('not valid')
  }
}
</script>
<template>
  <h1>Welcome to VCA Animal Hospital</h1>
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

    <Button label="Continue" @click="verify" />
  </div>
</template>
