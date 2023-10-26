<script setup>
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { useCurrentPetProfileStep } from '~/composables/states.ts'

definePageMeta({
  layout: 'pet',
})
const currentPetProfileStep = useCurrentPetProfileStep()
const medsEntryRef = ref(null)

onBeforeMount(async () => {
  currentPetProfileStep.value = 2
})
const calendarRef = ref([])
const preventativesArray = ref([])

// populate the preventatives array
PREVENTATIVES.forEach((pre) => {
  preventativesArray.value.push(PREVENTATIVE_ENTRY_OBJECT(pre.label))
})

const formData = reactive({
  preventatives: preventativesArray.value,
  preventatives_other: null,
  meds: [],
})

onMounted(() => {
  const localFormData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME))

  if (localFormData) {
    //format date

    if (localFormData.preventatives) {
      localFormData.preventatives.forEach((pre) => {
        pre.date = new Date(pre.date)
      })
    }

    formData.preventatives = localFormData.preventatives ?? preventativesArray.value
    formData.preventatives_other = localFormData.preventatives_other ?? null
    formData.meds = localFormData.meds ?? null
  }
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
  //remove all unchecked preventatives
  //formData.preventatives = formData.preventatives.filter((pre) => pre.checked)

  // update global state for pet profile
  // update browser local storage for pet profile
  savePetFormData(formData)

  // navigate to next step
  navigateTo(PET_PROFILE_STEPS[3].route)
}

const addMedsEntry = async () => {
  formData.meds.push(MEDS_ENTRY_OBJECT())
  await nextTick()
  const newEntryIndex = medsEntryRef.value.length - 1
  medsEntryRef.value[newEntryIndex].setFocus()
}
const updateMedsEntry = (dataObj, id) => {
  const thisEntry = formData.meds.find((entry) => entry.id === id)
  thisEntry.product = dataObj.product
  thisEntry.times_a_day = dataObj.times_a_day
  thisEntry.dose = dataObj.dose
}
const removeMedsEntry = (id) => {
  formData.meds = formData.meds.filter((entry) => entry.id !== id)
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
            <label class="question-text col-12">Preventatives (flea, tick & heartworm):</label>
            <div
              v-for="(pre, index) of formData.preventatives"
              :key="pre.product"
              class="preventative col-6 md:col-4 mb-2 md:mb-0"
              :class="[{ 'col-12 sm:col-6': isLast(index, PREVENTATIVES) }]"
            >
              <div class="flex flex-column">
                <div class="flex align-items-start">
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
                  </div>
                  <InputText
                    v-if="PREVENTATIVES[index].label === 'Other' && pre.checked"
                    v-model="pre.other"
                    type="text"
                    placeholder="Other Medication or Preventative"
                    class="mt-2 w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- medications vitamins -->
          <div class="col-12">
            <div class="flex flex-column gap-2">
              <label class="question-text">What are the medications, vitamins and supplements you give?</label>

              <MedsEntry
                v-for="(entry, index) of formData.meds"
                ref="medsEntryRef"
                :product="entry.product"
                :times="entry.times_a_day"
                :dose="entry.dose"
                :index="index"
                :totalLength="formData.meds.length"
                :key="`product-${entry.id}`"
                @update="updateMedsEntry($event, entry.id)"
                @remove="removeMedsEntry(entry.id)"
              />

              <!-- <div v-for="(item, index) in formData.meds" :key="index" class="-mt-1">
                <small class="p-error" v-if="v$.meds.$each.$response.$data[index].product.$error">
                  Product name is required.
                </small>
              </div> -->

              <div class="flex gap-2 align-items-center">
                <Button rounded icon="pi pi-plus" @click="addMedsEntry" />
                <p>Add medication/supplement</p>
              </div>
            </div>
          </div>
        </div>
        <Button type="submit" label="Continue" />
      </form>
    </section>
  </div>
</template>

<style lang="scss">
.pet-profile-rx {
  .pi-calendar {
    color: var(--text-color);
  }
  .dateAdministered input {
    cursor: pointer;
    border: none;
    padding: 0;
  }
}
</style>
