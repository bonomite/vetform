<script setup>
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { useCurrentPetProfileStep } from '~/composables/states.ts'
import { preventatives } from '~/composables/globals.ts'

definePageMeta({
  layout: 'pet',
})
const currentPetProfileStep = useCurrentPetProfileStep()

onBeforeMount(async () => {
  currentPetProfileStep.value = 2
})

const formData = reactive({
  preventatives: null,
  preventatives_other: null,
})

const submit = async () => {
  // update global state for pet profile
  // update browser local storage for pet profile
  savePetFormData(formData)

  // navigate to next step
  navigateTo(petProfileSteps[3].route)
}
watch(formData, () => {
  console.log('formData = ', formData.value)
})
</script>
<template>
  <div class="pet-profile-rx">
    <section class="question your-pet">
      <h1>Medications and/or supplements</h1>
      <form novalidate @submit.prevent="submit">
        <div class="grid row-gap-4 my-gutter">
          <div class="grid col-12">
            <label class="question-text col-12">Select all that apply:</label>
            <div
              v-for="(preventative, index) of preventatives"
              :key="preventative.key"
              class="col-6 md:col-4 mb-2 md:mb-0"
              :class="[{ 'col-12 sm:col-6': isLast(index, preventatives) }]"
            >
              <div class="flex flex-column">
                <div class="flex align-items-center">
                  <Checkbox
                    v-model="formData.preventatives"
                    :inputId="preventative.key"
                    name="preventative"
                    :value="preventative.label"
                  />
                  <label :for="preventative.key" class="ml-2 line-height-2">{{ preventative.label }}</label>
                  <!-- v-if="preventative.date" -->
                  <label class="flex align-items-center ml-2 line-height-2">
                    <i class="pi pi-calendar" />
                    <Calendar v-model="preventative.date" touchUI class="preventativeDate" />
                  </label>
                </div>
                <InputText
                  v-if="isLast(index, preventatives) && formData.preventatives?.includes('Other')"
                  v-model="formData.preventatives_other"
                  type="text"
                  placeholder="Other lifestyle"
                  class="mt-2 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<style lang="scss">
.pet-profile-rx {
  .pi-calendar {
    color: var(--text-color);
    cursor: pointer;
  }
  .preventativeDate input {
    cursor: pointer;
    //border: none;
    padding: 0.25rem;
  }
}
</style>
