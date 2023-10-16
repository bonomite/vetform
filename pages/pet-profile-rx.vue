<script setup>
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { useCurrentPetProfileStep } from '~/composables/states.ts'
import { preventatives } from '~/composables/globals.ts'

definePageMeta({
  layout: 'pet',
})
const currentPetProfileStep = useCurrentPetProfileStep()
const preventativesRef = ref(null)

onBeforeMount(async () => {
  currentPetProfileStep.value = 2
})

const preventativeEntryObject = (label) => ({ id: randomId(), product: label, date: null })
const preventativesArray = []
const preventativesTemp = ref(null)

const preventativeChange = (event, label, index) => {
  console.log('event?.target?.className = ', event?.target?.className)
  if (event?.target?.includes('p-highlight')) {
    preventativesArray.splice(index, 1)
  } else {
    preventativesArray.push(preventativeEntryObject(label))
  }
  console.log('formData.preventatives = ', formData.preventatives)
}

const formData = reactive({
  preventatives: preventativesArray,
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
  console.log('formData = ', formData.preventatives)
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
              ref="preventativesRef"
              :key="preventative.label"
              class="col-6 md:col-4 mb-2 md:mb-0"
              :class="[{ 'col-12 sm:col-6': isLast(index, preventatives) }]"
            >
              <div class="flex flex-column">
                <div class="flex align-items-center">
                  <!-- v-model="formData.preventatives" -->
                  <Checkbox
                    v-model="preventativesTemp"
                    :inputId="preventative.label"
                    name="preventative"
                    :value="preventative.label"
                    @change="preventativeChange($event, preventative.label, index)"
                  />
                  <label :for="preventative.label" class="ml-2 line-height-4">{{ preventative.label }}</label>

                  <div
                    v-if="formData?.preventatives[0]?.product?.includes(preventative.label)"
                    class="flex align-items-center ml-2"
                  >
                    <i class="pi pi-calendar" />
                    <Calendar v-model="formData.preventativesDate" touchUI class="preventativeDate" />
                  </div>
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
    padding: 0;
  }
}
</style>
