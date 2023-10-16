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
const calendarRef = ref([])
const preventativesArray = ref([])
const preventativeEntryObject = (label) => ({ product: label, date: null, checked: false, other: null })

// populate the preventatives array
preventatives.forEach((pre) => {
  preventativesArray.value.push(preventativeEntryObject(pre.label))
})

const formData = reactive({
  preventatives: preventativesArray.value,
  preventatives_other: null,
})

const handleCheckboxChange = (index) => {
  if (formData.preventatives[index].checked) {
    // target the associated Calendar component
    const calendar = calendarRef.value[index].$el.querySelector('.p-inputtext')
    // Simulate a click on the calendar
    calendar.click()
  }
}

const handleCalendarClose = (index) => {
  // If no date is selected, uncheck the checkbox
  if (!formData.preventatives[index].date) {
    formData.preventatives[index].checked = false
  }
}

const submit = async () => {
  // update global state for pet profile
  // update browser local storage for pet profile
  savePetFormData(formData)

  // navigate to next step
  navigateTo(petProfileSteps[3].route)
}
// watch(formData, () => {
//   console.log('formData = ', formData.preventatives)
// })
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
              v-for="(pre, index) of formData.preventatives"
              :key="pre.product"
              class="preventative col-6 md:col-4 mb-2 md:mb-0"
              :class="[{ 'col-12 sm:col-6': isLast(index, preventatives) }]"
            >
              <div class="flex flex-column">
                <div class="flex align-items-start">
                  <!-- v-model="formData.preventatives" -->
                  <Checkbox
                    v-model="pre.checked"
                    :inputId="pre.product"
                    name="preventative"
                    :value="pre.checked"
                    :binary="true"
                    @change="handleCheckboxChange(index)"
                  />
                  <div>
                    <label :for="pre.product" class="ml-2 line-height-1">{{ pre.product }}</label>

                    <div v-show="pre.checked">
                      <div class="flex align-items-center ml-2">
                        <i class="pi pi-calendar mr-1" />
                        <Calendar
                          ref="calendarRef"
                          v-model="pre.date"
                          touchUI
                          class="dateAdministered"
                          @hide="handleCalendarClose(index)"
                        >
                          <template #footer>
                            <div class="text-center text-xl font-bold py-4 px-3">
                              When did you last administer this product?
                            </div>
                          </template>
                        </Calendar>
                      </div>
                    </div>
                    <InputText
                      v-if="preventatives[index].label === 'Other' && pre.checked"
                      v-model="pre.other"
                      type="text"
                      placeholder="Other Medication or Preventative"
                      class="mt-2 w-full"
                    />
                  </div>
                </div>
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
  .dateAdministered input {
    cursor: pointer;
    border: none;
    padding: 0;
  }
}
</style>
