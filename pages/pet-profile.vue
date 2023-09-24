<script setup>
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast'
import { useCurrentUser, useCurrentUserProfile } from '~/composables/states.ts'

const currentUser = useCurrentUser()
const currentUserProfile = useCurrentUserProfile()
const toast = useToast()
const client = useSupabaseClient()

const steps = ref([
  {
    index: 0,
    label: 'Your Pet',
    route: '/',
  },
  {
    index: 1,
    label: 'Lifestyle',
    route: '/seat',
  },
  {
    index: 2,
    label: 'Rx/Preventatives',
    route: '/payment',
  },
  {
    index: 3,
    label: 'Insurance',
    route: '/confirmation',
  },
])

const selectedPetType = ref()
const petTypes = ref([
  { name: 'Dog' },
  { name: 'Cat' },
  { name: 'Rabbit' },
  { name: 'Bird' },
  { name: 'Guinea pig' },
  { name: 'Hamster' },
  { name: 'Chinchillas' },
  { name: 'Rat' },
  { name: 'Hedgehogs' },
  { name: 'Other' },
])

const tempPetsCount = ref(0)
const currentStep = ref(0)

const isActive = (item) => {
  console.log('item   ', item)
  return item.index === currentStep.value ? true : false
}

const rules = computed(() => {
  return {
    pet_name: {
      required: helpers.withMessage('First name is required', required),
    },
  }
})

const formData = reactive({
  pet_name: '',
})

const v$ = useVuelidate(rules, formData)
</script>

<template>
  <div class="pet-profile">
    <div class="header">
      <Steps
        :model="steps"
        aria-label="Form Steps"
        :readonly="true"
        :pt="{
          menuitem: ({ context }) => ({
            class: isActive(context.item) && 'p-highlight p-steps-current',
          }),
        }"
      >
      </Steps>
    </div>
    <section class="question your-pet">
      <h1>
        New, tell us about your {{ tempPetsCount > 1 ? 'other' : '' }} pet...
      </h1>

      <div class="grid my-gutter">
        <div class="col-12 sm:col-6">
          <div class="flex flex-column gap-2">
            <label for="first_name">Pet name</label>
            <InputText
              label="Pet Name"
              v-model="formData.pet_name"
              :class="{
                'p-invalid': v$.pet_name.$error && v$.pet_name.$invalid,
              }"
            ></InputText>
            <Error :errArr="v$.pet_name.$errors" />
          </div>
        </div>
        <div class="col-12 sm:col-6">
          <div class="flex flex-column gap-2">
            <label for="first_name">Pet type</label>
            <div class="card flex justify-content-center">
              <Dropdown
                v-model="selectedPetType"
                :options="petTypes"
                optionLabel="name"
                placeholder="Select"
                class="w-full md:w-14rem"
              />
            </div>
            <Error :errArr="v$.pet_name.$errors" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
$container-breakpoint-sm: 470px;

.my-gutter [class*='col'] {
  padding: 1rem;
}
.pet-profile {
  container-type: inline-size;

  .header {
    position: sticky;
    top: 10px;
    left: 0;
    right: 0;
    width: 100%;
    .p-steps {
      @container (max-width: #{$container-breakpoint-sm}) {
        font-size: 0.75rem;
      }
    }
  }
}
</style>
