<script setup>
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast'
import { useCurrentUser, useCurrentUserProfile } from '~/composables/states.ts'
import {
  petTypes,
  petProfileSteps,
  sexTypes,
  yesNoTypes,
  trackingTypes,
} from '~/composables/globals.ts'

const currentUser = useCurrentUser()
const currentUserProfile = useCurrentUserProfile()
const toast = useToast()
const client = useSupabaseClient()

const selectedPetType = ref()
const selectedSex = ref()
const selectedSpayedNeutered = ref()
const selectedTracking = ref()

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
  name: null,
  type: null,
  sex: null,
  spayed_neutered: null,
  age: null,
  tracking: null,
})

const v$ = useVuelidate(rules, formData)
</script>

<template>
  <div class="pet-profile">
    <div class="header">
      <Steps
        :model="petProfileSteps"
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
        Now, tell us about your {{ tempPetsCount > 1 ? 'other' : '' }} pet...
      </h1>

      <div class="grid row-gap-4 my-gutter">
        <!-- Pet Name -->
        <div class="col-12 sm:col-6">
          <div class="flex flex-column gap-2">
            <label for="pet_name">Pet name</label>
            <InputText
              label="Pet Name"
              v-model="formData.pet_name"
              :class="{
                'p-invalid': v$.pet_name.$error && v$.pet_name.$invalid,
              }"
              autofocus
            ></InputText>
            <Error :errArr="v$.pet_name.$errors" />
          </div>
        </div>

        <!-- Pet Type -->
        <div class="col-12 sm:col-6">
          <div class="flex flex-column gap-2">
            <label for="pet_type">Pet type</label>
            <div class="card flex justify-content-center">
              <Dropdown
                v-model="formData.type"
                :options="petTypes"
                optionLabel="type"
                placeholder="Select"
                class="w-full"
              />
            </div>
            <Error :errArr="v$.pet_name.$errors" />
          </div>
        </div>

        <!-- Sex Test -->
        <!-- <div class="col-12 sm:col-6">
          <SelectButtonQuestion
            label="Sex"
            :options="['Male', 'Female ']"
            sbTable="pets"
            sbColumn="sex"
          />
        </div> -->

        <!-- Sex -->
        <div class="col-12 sm:col-6">
          <div class="flex flex-column gap-2">
            <label for="first_name">Sex</label>
            <div class="card flex">
              <SelectButton
                v-model="formData.sex"
                :options="sexTypes"
                aria-labelledby="basic"
              />
            </div>
            <Error :errArr="v$.pet_name.$errors" />
          </div>
        </div>

        <!-- Spayed / Neutered -->
        <div class="col-12 sm:col-6">
          <div class="flex flex-column gap-2">
            <label for="spayed_neutered">Spayed / neutered</label>
            <div class="card flex">
              <SelectButton
                label="spayed_neutered"
                v-model="formData.spayed_neutered"
                :options="yesNoTypes"
                aria-labelledby="basic"
              />
            </div>
            <Error :errArr="v$.pet_name.$errors" />
          </div>
        </div>

        <!-- Age -->
        <div class="col-12 sm:col-6">
          <div class="flex flex-column gap-2">
            <label for="age">Age</label>
            <div class="card flex gap-4 align-items-center">
              <div><InputText placeholder="0" class="max-w-3rem" /> Yr</div>
              <div><InputText placeholder="0" class="max-w-3rem" /> Mo</div>
            </div>
            <Error :errArr="v$.pet_name.$errors" />
          </div>
        </div>

        <!-- Microchipped / tattooed -->
        <div class="col-12 sm:col-6">
          <div class="flex flex-column gap-2">
            <label for="microchipped_tattooed">Microchipped / tattooed</label>
            <div class="card flex">
              <SelectButton
                label="microchipped_tattooed"
                v-model="formData.tracking"
                :options="trackingTypes"
                aria-labelledby="basic"
                multiple
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
  //padding: 1rem;
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
