<script setup>
import { useCurrentPetProfileStep, usePetProfileData } from "~/composables/states"
import { useVuelidate } from "@vuelidate/core"
import { email, helpers, minLength, required } from "@vuelidate/validators"

definePageMeta({
  layout: "pet",
})
const isReady = ref(false)
const currentPetProfileStep = useCurrentPetProfileStep()
const petProfileData = usePetProfileData()
const foodEntryRef = ref(null)

onBeforeMount(async () => {
  currentPetProfileStep.value = 1
})

const formData = reactive({
  lifestyles: null,
  lifestyles_other: null,
  household_less_than_6_months: null,
  pet_aquired_from: null,
  describe_housing: null,
  food: [FOOD_ENTRY_OBJECT()],
  grain_free: null,
})

onMounted(() => {
  const localFormData = getAndSetCurrentPetProfile()
  if (localFormData) {
    formData.lifestyles = localFormData.lifestyles ?? null
    formData.lifestyles_other = localFormData.lifestyles_other ?? null
    formData.household_less_than_6_months =
      localFormData.household_less_than_6_months ?? null
    formData.pet_aquired_from = localFormData.pet_aquired_from ?? null
    formData.describe_housing = localFormData.describe_housing ?? null
    formData.food = localFormData.food ?? [FOOD_ENTRY_OBJECT()]
    formData.grain_free = localFormData.grain_free ?? null
  }
  isReady.value = true
})

const isLessThan6MonthsOrExotic = () => {
  return formData.household_less_than_6_months === "Yes" || isExotic.value
}

const rules = computed(() => {
  return {
    household_less_than_6_months: {
      required: helpers.withMessage("Answer is required", required),
    },
    pet_aquired_from: {
      required: function () {
        return isLessThan6MonthsOrExotic()
          ? helpers.withMessage("Answer is required", required)
          : true
      },
    },
    describe_housing: {
      required: function () {
        return isExotic.value ? helpers.withMessage("Answer is required", required) : true
      },
    },
    food: {
      $each: helpers.forEach({
        product: { required },
      }),
    },
    grain_free: {
      required: helpers.withMessage("Answer is required", required),
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
    savePetFormData(formData)

    // navigate to next step
    navigateTo(PET_PROFILE_STEPS[2].route)
  } else {
    scrollToFirstValidationError()
  }
}

const addFoodEntry = async () => {
  formData.food.push(FOOD_ENTRY_OBJECT())
  await nextTick()
  const newEntryIndex = foodEntryRef.value.length - 1
  foodEntryRef.value[newEntryIndex].setFocus()
}
const updateFoodEntry = (dataObj, id) => {
  const thisEntry = formData.food.find((entry) => entry.id === id)
  thisEntry.product = dataObj.product
  thisEntry.times_a_day = dataObj.times_a_day
}
const removeFoodEntry = (id) => {
  formData.food = formData.food.filter((entry) => entry.id !== id)
}
</script>
<template>
  <div v-if="isReady" class="pet-profile">
    <section class="question your-pet">
      <h1>Your pet's lifestyle</h1>

      <form novalidate @submit.prevent="submit">
        <div class="grid row-gap-4 my-gutter">
          <div class="grid col-12">
            <label class="question-text col-12">Select all that apply:</label>
            <div
              v-for="(lifestyle, index) of LIFESTYLES"
              :key="lifestyle.key"
              class="col-6 md:col-4 mb-2"
              :class="[{ 'col-12 sm:col-6': isLast(index, LIFESTYLES) }]"
            >
              <div class="flex flex-column">
                <div class="flex align-items-center">
                  <Checkbox
                    v-model="formData.lifestyles"
                    :inputId="lifestyle.key"
                    name="lifestyle"
                    :value="lifestyle.label"
                  />
                  <label :for="lifestyle.key" class="ml-2 line-height-2">{{
                    lifestyle.label
                  }}</label>
                </div>
                <InputText
                  v-if="
                    isLast(index, LIFESTYLES) && formData.lifestyles?.includes('Other')
                  "
                  v-model="formData.lifestyles_other"
                  type="text"
                  placeholder="Other lifestyle"
                  class="mt-2 w-full"
                />
              </div>
            </div>
          </div>

          <!-- household <6 months -->
          <div class="col-12 sm:col-6">
            <div class="flex flex-column gap-2">
              <label class="question-text"
                >Has {{ getName }} been in your household less than 6 months?</label
              >

              <div class="flex">
                <SelectButton
                  label="spayed_neutered"
                  v-model="formData.household_less_than_6_months"
                  :options="NOYESOPTIONS"
                  aria-labelledby="basic"
                  :class="{
                    'p-invalid':
                      v$.household_less_than_6_months.$error &&
                      v$.household_less_than_6_months.$invalid,
                  }"
                />
              </div>
              <Error :errArr="v$.household_less_than_6_months.$errors" />
            </div>
          </div>

          <!-- Aquired -->
          <!-- IF EXOTIC  or < 6 MONTHS -->

          <div class="col-12 sm:col-6" v-if="isLessThan6MonthsOrExotic()">
            <div class="flex flex-column gap-2">
              <label class="question-text">Where did you aquire {{ getName }}?</label>
              <div class="grid">
                <div
                  v-for="option in PET_AQUIRED_FROM_OPTIONS"
                  :key="option"
                  class="flex align-items-center col-6"
                >
                  <RadioButton
                    v-model="formData.pet_aquired_from"
                    :inputId="option"
                    name="pizza"
                    :value="option"
                  />
                  <label :for="option" class="ml-2 line-height-2">{{ option }}</label>
                </div>
                <Error :errArr="v$.pet_aquired_from.$errors" />
              </div>
            </div>
          </div>

          <!-- IF EXOTIC  -->
          <!-- Describe housing/enclosure -->

          <div v-if="isExotic" class="col-12 sm:col-6">
            <div class="flex flex-column gap-2">
              <label class="question-text" for="pet_name"
                >Describe housing/enclosure (include substrate/litter)</label
              >
              <Textarea
                v-model="formData.describe_housing"
                rows="4"
                cols="30"
                :class="{
                  'p-invalid': v$.describe_housing.$error && v$.describe_housing.$invalid,
                }"
              />
              <Error :errArr="v$.describe_housing.$errors" />
            </div>
          </div>

          <!-- food -->
          <div class="col-12 md:col-6">
            <div class="flex flex-column gap-2">
              <label class="question-text">What are the foods and snacks you give?</label>
              <FoodEntry
                v-for="(entry, index) of formData.food"
                ref="foodEntryRef"
                :product="entry.product"
                :times="entry.times_a_day"
                :index="index"
                :totalLength="formData.food.length"
                :key="`product-${entry.id}`"
                :invalid="v$.food.$error && v$.food.$invalid"
                @update="updateFoodEntry($event, entry.id)"
                @remove="removeFoodEntry(entry.id)"
              />
              <!-- <FoodEntry
                v-for="(entry, index) of formData.food"
                v-model:product="entry.product"
                v-model:times="entry.times_a_day"
                :index="index"
                :totalLength="formData.food.length"
                :key="`product-${entry.id}`"
                @remove="removeFoodEntry(entry.id)"
                :invalid="v$.food.$error && v$.food.$invalid"
              /> -->

              <div v-for="(item, index) in formData.food" :key="index" class="-mt-1">
                <small
                  class="p-error"
                  v-if="v$.food.$each.$response.$data[index].product.$error"
                >
                  Product name is required.
                </small>
              </div>

              <div class="flex gap-2 align-items-center">
                <Button rounded icon="pi pi-plus" @click="addFoodEntry" />
                <p>Add another product</p>
              </div>
            </div>
          </div>

          <!-- grain free -->
          <div class="col-12 sm:col-6">
            <div class="flex flex-column gap-2">
              <label class="question-text"
                >Are any of these foods raw or grain free?</label
              >
              <div class="flex">
                <SelectButton
                  label="spayed_neutered"
                  v-model="formData.grain_free"
                  :options="NOYESOPTIONS"
                  aria-labelledby="basic"
                  :class="{
                    'p-invalid': v$.grain_free.$error && v$.grain_free.$invalid,
                  }"
                />
              </div>
              <Error :errArr="v$.grain_free.$errors" />
            </div>
          </div>
        </div>
        <Button type="submit" label="Continue" />
      </form>
    </section>
  </div>
</template>
