import loginVue from '~/pages/login.vue';
<script setup>
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast'
import { useCurrentUser } from '~/composables/states.ts'

const currentUser = useCurrentUser()
const toast = useToast()
const client = useSupabaseClient()

console.log('currentUser.value', currentUser.value)

const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  errorMessage: {
    type: String,
    default: 'An answer is required',
  },
  options: {
    type: Array,
    default: ['Yes', 'No'],
  },
  sbTable: {
    type: String,
    default: null,
    required: true,
  },
  sbColumn: {
    type: String,
    default: null,
    required: true,
  },
})

const selectedOption = ref()

const rules = computed(() => {
  return {
    ans: {
      required: helpers.withMessage(props.errorMessage, required),
    },
  }
})

const formData = reactive({
  ans: null,
})

const v$ = useVuelidate(rules, formData)

const submitAnswer = async () => {
  v$.value.$validate()
  if (!v$.value.$error) {
    //validation passed

    const { error } = await client
      .from(props.table)
      .upsert({
        sbColumn: formData.ans,
      })
      .eq('id', currentUser.value.id)
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
    }
  }
}
</script>

<template>
  <div class="select-button-question">
    <div class="flex flex-column gap-2">
      <label v-if="label">{{ props.label }}</label>
      <div class="card flex">
        <SelectButton
          v-model="formData.ans"
          :options="props.options"
          aria-labelledby="basic"
          @change="submitAnswer"
        />
      </div>
      <Error :errArr="v$.ans.$errors" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-button-question {
}
</style>
