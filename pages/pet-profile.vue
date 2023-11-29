<script setup>
import { useVuelidate } from "@vuelidate/core"
import { helpers, required } from "@vuelidate/validators"
import { savePetFormData } from "~/utils/dataManagement"
import { useCurrentPetProfileStep } from "~/composables/states.ts"

definePageMeta({
  layout: "pet",
})
const isReady = ref(false)
const currentPetProfileStep = useCurrentPetProfileStep()
const tempPetsCount = ref(0)

onBeforeMount(async () => {
  currentPetProfileStep.value = 0
})

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("Pet name is required", required),
    },
    type: {
      required: helpers.withMessage("Pet type is required", required),
    },
    sex: {
      required: helpers.withMessage("Pet sex is required", required),
    },
    spayed_neutered: {
      required: helpers.withMessage("Answer is required", required),
    },
    dob: {
      required: helpers.withMessage("Pet age is required", required),
    },
  }
})

const formData = reactive({
  name: null,
  type: null,
  sex: null,
  spayed_neutered: null,
  dob: null,
  tracking: null,
  image: null,
})

onMounted(() => {
  const localFormData = getAndSetCurrentPetProfile()
  if (localFormData) {
    formData.name = localFormData.name ?? null
    formData.type = localFormData.type ?? null
    formData.sex = localFormData.sex ?? null
    formData.spayed_neutered = localFormData.spayed_neutered ?? null
    formData.dob = localFormData.dob ? new Date(localFormData.dob) : null
    formData.tracking = localFormData.tracking ?? null
    formData.image = localFormData.image ?? null
  }
  isReady.value = true
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
    navigateTo(PET_PROFILE_STEPS[1].route)
  } else {
    scrollToFirstValidationError()
  }
}

async function convertBlobToBase64(event) {
  const url = event.files[0].objectURL
  const blob = await fetch(url).then((r) => r.blob())

  const reader = new FileReader()
  reader.onloadend = () => {
    const dataURL = reader.result
    formData.image = dataURL
  }
  reader.readAsDataURL(blob)
}

const imageRemove = () => {
  formData.image = null
}
</script>

<template>
  <div v-if="isReady" class="pet-profile">
    <section class="question your-pet">
      <h1>Now, tell us about your {{ tempPetsCount > 1 ? "other" : "" }} pet...</h1>

      <form novalidate @submit.prevent="submit">
        <div class="grid row-gap-4 my-gutter">
          <!-- Pet Name -->
          <div class="col-12 sm:col-6">
            <div class="flex flex-column gap-2">
              <label class="question-text" for="pet_name">Pet name</label>
              <InputText
                label="Pet Name"
                v-model="formData.name"
                :class="{
                  'p-invalid': v$.name.$error && v$.name.$invalid,
                }"
                autofocus
              ></InputText>
              <Error :errArr="v$.name.$errors" />
            </div>
          </div>

          <!-- Pet Type -->
          <div class="col-12 sm:col-6">
            <div class="flex flex-column gap-2">
              <label class="question-text" for="pet_type">Pet type</label>
              <div class="card flex justify-content-center">
                <Dropdown
                  v-model="formData.type"
                  :options="PETOPTIONS"
                  optionLabel="label"
                  placeholder="Select"
                  class="w-full"
                  :class="{
                    'p-invalid': v$.type.$error && v$.type.$invalid,
                  }"
                />
              </div>
              <Error :errArr="v$.type.$errors" />
            </div>
          </div>

          <!-- Sex -->
          <div class="col-12 sm:col-6">
            <div class="flex flex-column gap-2">
              <label class="question-text" for="first_name">Sex</label>
              <div class="card flex">
                <SelectButton
                  v-model="formData.sex"
                  :options="SEXOPTIONS"
                  aria-labelledby="basic"
                  :class="{
                    'p-invalid': v$.sex.$error && v$.sex.$invalid,
                  }"
                />
              </div>
              <Error :errArr="v$.sex.$errors" />
            </div>
          </div>

          <!-- Spayed / Neutered -->
          <div class="col-12 sm:col-6">
            <div class="flex flex-column gap-2">
              <label class="question-text" for="spayed_neutered">Spayed / neutered</label>
              <div class="card flex">
                <SelectButton
                  label="spayed_neutered"
                  v-model="formData.spayed_neutered"
                  :options="NOYESOPTIONS"
                  aria-labelledby="basic"
                  :class="{
                    'p-invalid': v$.spayed_neutered.$error && v$.spayed_neutered.$invalid,
                  }"
                />
              </div>
              <Error :errArr="v$.spayed_neutered.$errors" />
            </div>
          </div>

          <!-- Age -->
          <div class="col-12 sm:col-6">
            <div class="flex flex-column gap-2">
              <label class="question-text" for="age">Date of birth</label>
              <div class="card flex gap-4 align-items-center">
                <Calendar
                  v-model="formData.dob"
                  showIcon
                  :class="{
                    'p-invalid': v$.dob.$error && v$.dob.$invalid,
                  }"
                />
              </div>
              <Error :errArr="v$.dob.$errors" />
            </div>
          </div>

          <!-- Microchipped / tattooed -->
          <div class="col-12 sm:col-6">
            <div class="flex flex-column gap-2">
              <label class="question-text" for="microchipped_tattooed"
                >Microchipped / tattooed</label
              >
              <div class="card flex">
                <SelectButton
                  label="microchipped_tattooed"
                  v-model="formData.tracking"
                  :options="TRACKING_OPTIONS"
                  aria-labelledby="basic"
                  multiple
                />
              </div>
              <!-- <Error :errArr="v$.tracking.$errors" /> -->
            </div>
          </div>

          <!-- photo -->
          <div class="col-12">
            <div class="question-text mb-2" for="image">Photo</div>
            <FileUpload
              v-if="!formData.image"
              mode="basic"
              :fileLimit="1"
              :multiple="false"
              accept="image/jpeg"
              :maxFileSize="5000000"
              @select="(e) => convertBlobToBase64(e)"
            ></FileUpload>

            <div v-else class="thumb-box flex justify-content-between align-items-center">
              <div class="image-holder">
                <img
                  role="presentation"
                  class="p-fileupload-file-thumbnail"
                  alt="uploaded pet image"
                  :src="formData.image"
                  width="100"
                  height="100"
                  style="object-fit: cover"
                  data-pc-section="thumbnail"
                />
              </div>
              <Button rounded icon="pi pi-times" @click="imageRemove" />
            </div>
          </div>

          <Button type="submit" label="Continue" />
        </div>
      </form>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.my-gutter [class*="col"] {
  //padding: 1rem;
}
.pet-profile {
  container-type: inline-size;
  .p-fileupload-buttonbar {
    button {
      display: none !important;
    }
  }
  .thumb-box {
    background: #eff3f8;
    padding: 1.25rem;
    border: 1px solid #dfe7ef;
    color: #708da9;
    border-bottom: 0 none;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    gap: 0.5rem;
    .p-fileupload-file-thumbnail {
      object-fit: cover;
      border-radius: 50%;
    }
  }
}
</style>

<style lang="scss">
.p-fileupload-buttonbar {
  button {
    display: none !important;
  }
}
</style>
