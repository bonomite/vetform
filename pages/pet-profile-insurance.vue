<script setup>
import { useCurrentPetProfileStep } from '~/composables/states.ts'
import { INSURANCEPROVIDERS } from '~/utils/globals.ts'
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
definePageMeta({
  layout: 'pet',
})
const currentPetProfileStep = useCurrentPetProfileStep()
onBeforeMount(async () => {
  currentPetProfileStep.value = 3
})

const formData = reactive({
  has_insurance: null,
  provider: null,
  provider_other: null,
  other_hospitals: null,
  other_hospital_name: null,
  other_hospital_visit: null,
})

onMounted(() => {
  const localFormData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME))

  if (localFormData) {
    formData.has_insurance = localFormData.has_insurance ?? null
    formData.provider = localFormData.provider ?? null
    formData.provider_other = localFormData.provider_other ?? null
    formData.other_hospitals = localFormData.other_hospitals ?? null
    formData.other_hospital_name = localFormData.other_hospital_name ?? null
    formData.other_hospital_visit = new Date(localFormData.other_hospital_visit) ?? null
  }
})

const rules = computed(() => {
  return {
    has_insurance: {
      required: helpers.withMessage('Answer is required', required),
    },
    other_hospitals: {
      required: helpers.withMessage('Answer is required', required),
    },
  }
})

const v$ = useVuelidate(rules, formData)

const submit = async () => {
  v$.value.$validate()
  if (!v$.value.$error) {
    // No validation error, navigate to next step

    // update global state for pet profile
    // update browser local storage for pet profile
    savePetFormData(formData, true)

    // TODO: if one pet only, go directly to ABOUT TODAY, if they added an additional pet, do to the DASHBAORD
    navigateTo('/dashboard')
  } else {
    scrollToFirstValidationError()
  }
}
</script>
<template>
  <div class="pet-profile">
    <section class="question your-pet">
      <h1>Insurance for your pet</h1>

      <form novalidate @submit.prevent="submit">
        <div class="grid row-gap-4 my-gutter">
          <div class="grid col-12">
            <!-- have insrance -->
            <div class="col-12 sm:col-6">
              <div class="flex flex-column gap-2">
                <label class="question-text" for="has_insurance">
                  Does {{ getName.value }} have pet health insurance?
                </label>
                <div class="card flex">
                  <SelectButton
                    label="has_insurance"
                    v-model="formData.has_insurance"
                    :options="NOYESOPTIONS"
                    aria-labelledby="basic"
                    :class="{
                      'p-invalid': v$.has_insurance.$error && v$.has_insurance.$invalid,
                    }"
                  />
                </div>
                <Error :errArr="v$.has_insurance.$errors" />
              </div>
            </div>
            <!-- Insurance Provider -->
            <div v-if="formData.has_insurance === 'Yes'" class="col-12 sm:col-6">
              <div class="flex flex-column gap-2">
                <label class="question-text" for="Insurance_provider">Who is your insurance prodiver?</label>
                <div class="card flex justify-content-center">
                  <Dropdown
                    v-model="formData.provider"
                    :options="INSURANCEPROVIDERS"
                    optionLabel="label"
                    filter
                    placeholder="Select provider"
                    class="w-full"
                  />
                </div>
              </div>
            </div>
            <!-- other_hospitals -->
            <div class="col-12 sm:col-6">
              <div class="flex flex-column gap-2">
                <label class="question-text" for="other_hospitals">
                  Has {{ getName.value }} received care at any other hospitals or vaccine clinics in the past year?
                </label>
                <div class="card flex">
                  <SelectButton
                    label="other_hospitals"
                    v-model="formData.other_hospitals"
                    :options="NOYESOPTIONS"
                    aria-labelledby="basic"
                    :class="{
                      'p-invalid': v$.other_hospitals.$error && v$.other_hospitals.$invalid,
                    }"
                  />
                </div>
                <Error :errArr="v$.other_hospitals.$errors" />
              </div>
            </div>

            <div v-if="formData.other_hospitals === 'Yes'" class="col-12 sm:col-6">
              <!-- other_hospital_name -->
              <div class="w-full mb-3">
                <div class="flex flex-column gap-2">
                  <label class="question-text" for="other_hospital_name">What hospital or clinic?</label>
                  <InputText
                    label="Hospital or clinic name"
                    v-model="formData.other_hospital_name"
                    autofocus
                  ></InputText>
                </div>
              </div>

              <!-- other_hospital_visit -->
              <div class="w-full">
                <div class="flex flex-column gap-2">
                  <label class="question-text" for="other_hospital_visit">When did you last visit?</label>
                  <div class="card flex gap-4 align-items-center">
                    <Calendar v-model="formData.other_hospital_visit" showIcon class="w-full" />
                  </div>
                </div>
              </div>
              <p>
                Please arrange to have {{ getName.value }}'s records sent to us at
                <NuxtLink to="mailto:au1297@vca.com">au1297@vca.com</NuxtLink>
              </p>
            </div>
          </div>
        </div>
        <Button type="submit" label="Continue" />
      </form>
    </section>
  </div>
</template>
