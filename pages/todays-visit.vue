<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core"
import { helpers, required } from "@vuelidate/validators"
import {
  useCurrentUser,
  useCurrentUserProfile,
  useSelectedPet,
} from "~/composables/states"
import { VISIT_LOCAL_STORAGE_NAME } from "~/utils/globals.ts"
import { saveVisitFormData } from "~/utils/dataManagement"
import { useToast } from "primevue/usetoast"

definePageMeta({
  middleware: "get-selected-pet",
})

const isReady = ref(false)

const currentUser = useCurrentUser()
const currentUserProfile = useCurrentUserProfile()
const toast = useToast()
const selectedPet = useSelectedPet()
const isExotic = ref(selectedPet.value?.type?.exotic)

const rules = computed(() => {
  return {
    goals_concerns: {
      required: helpers.withMessage("Goals and concerns are  required", required),
    },
    refills: {
      required: helpers.withMessage("Answer required", required),
    },
    skin_lesions: {
      required: helpers.withMessage("Answer required", required),
    },
    preventatives: {
      required: helpers.withMessage("Answer required", required),
    },
  }
})

watch(selectedPet, () => {})

const formData = reactive({
  goals_concerns: null,
  refills: null,
  skin_lesions: null,
  skin_lesions_coordinates: [],
  images: [],
  preventatives: [],
})

watch(formData, () => {
  console.log("formData = ", formData)
  localStorage.setItem(VISIT_LOCAL_STORAGE_NAME, JSON.stringify(formData))
})

const formatDates = (arr) => {
  const newArr = []
  arr.forEach((item) => {
    if (item) {
      newArr.push(new Date(item))
    }
  })
  return newArr
}

onMounted(() => {
  const localFormData = getAndSetCurrentVisit()

  if (localFormData) {
    console.log("localFormData = ", localFormData)
    formData.goals_concerns = localFormData.goals_concerns ?? null
    formData.refills = localFormData.refills ?? null
    formData.skin_lesions = localFormData.skin_lesions ?? null
    formData.skin_lesions_coordinates = localFormData.skin_lesions_coordinates ?? null
    formData.images = []
    formData.preventatives = formatDates(localFormData.preventatives) ?? []
  }

  isReady.value = true
})

const v$ = useVuelidate(rules, formData)

const submit = async () => {
  v$.value.$validate()
  if (!v$.value.$error) {
    saveVisitFormData(formData, selectedPet.value)
  } else {
    scrollToFirstValidationError()
  }
}

const editPetInfo = () => {
  navigateTo({
    path: "/pet-profile",
    query: {
      edit: "true",
    },
  })
}

//console.log("selectedPet", selectedPet)
</script>
<template>
  <section v-if="isReady && selectedPet" class="todays-visit">
    <div class="header flex align-items-center justify-content-between gap-2">
      <div class="flex align-items-center gap-2">
        <div class="pet-image flex-none">
          <img :src="selectedPet?.image" />
        </div>
        <h4>{{ selectedPet?.name }}</h4>
      </div>
      <Button
        class="flex-none"
        rounded
        icon="pi pi-home"
        @click="navigateTo('/dashboard')"
      />
    </div>

    <h1>Let's talk about today's visit!</h1>

    <form novalidate @submit.prevent="submit">
      <div class="grid row-gap-4 my-gutter">
        <!-- Goals and Concerns -->
        <div class="col-12 sm:col-6">
          <div class="flex flex-column gap-2">
            <label class="question-text" for="pet_name"
              >Tell us about your main goals/concerns for today's visit.</label
            >
            <Textarea
              v-model="formData.goals_concerns"
              rows="4"
              cols="30"
              :class="{
                'p-invalid': v$.goals_concerns.$error && v$.goals_concerns.$invalid,
              }"
              autofocus
            ></Textarea>
            <Error :errArr="v$.goals_concerns.$errors" />
          </div>
        </div>

        <!-- Refills -->
        <div class="col-12 sm:col-6">
          <div class="flex flex-column gap-2">
            <label class="question-text" for="spayed_neutered"
              >Do you need any medications refilled today?</label
            >
            <div class="card flex">
              <SelectButton
                label="refills"
                v-model="formData.refills"
                :options="NOYESOPTIONS"
                aria-labelledby="basic"
                :class="{
                  'p-invalid': v$.refills.$error && v$.refills.$invalid,
                }"
              />
            </div>
            <Error :errArr="v$.refills.$errors" />
          </div>
        </div>

        <!-- skin_lesions -->
        <div class="col-12 sm:col-6">
          <div class="flex flex-column gap-2">
            <label class="question-text" for="spayed_neutered"
              >Are there any masses or skin lesions that you are concerned about
              today?</label
            >
            <div class="card flex">
              <SelectButton
                label="skin_lesions"
                v-model="formData.skin_lesions"
                :options="NOYESOPTIONS"
                aria-labelledby="basic"
                :class="{
                  'p-invalid': v$.skin_lesions.$error && v$.skin_lesions.$invalid,
                }"
              />
            </div>
            <Error :errArr="v$.skin_lesions.$errors" />
          </div>
        </div>

        <!-- skin_lesions_coordinates -->
        <div v-if="formData.skin_lesions === 'Yes'" class="col-12 sm:col-6">
          <div class="flex flex-column gap-2">
            <label class="question-text" for="spayed_neutered"
              >Let us know where they are.</label
            >
            <div class="card flex">Special interactive element here</div>
          </div>
        </div>

        <!-- images -->
        <div class="col-12">
          <div class="question-text mb-2" for="image">
            Upload up to 3 images that may be helpful for us to see.
          </div>
          <FileUpload
            :fileLimit="3"
            :multiple="true"
            accept="image/jpeg"
            :maxFileSize="5000000"
            :chooseLabel="
              formData.images.length > 2 ? '3 image limit reached' : 'Add Image'
            "
            :class="{
              limit: formData.images.length > 2,
            }"
            :previewWidth="100"
            @select="(e) => (formData.images = e.files)"
          ></FileUpload>
        </div>

        <!-- preventatives date updates -->
        <div class="col-12">
          <div class="question-text mb-2" for="image">
            When did you last administer these preventatives?
          </div>
          <div v-if="selectedPet" class="flex flex-column gap-3">
            <div v-for="(p, index) in selectedPet.preventatives" :key="p.id">
              <div class="flex gap-3 align-items-center">
                <label for="icondisplay" class="font-bold block mb-2">
                  {{ p.product }}
                </label>
                <Calendar
                  v-model="formData.preventatives[index]"
                  showIcon
                  iconDisplay="input"
                  inputId="icondisplay"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- review pet info -->
        <div class="col-12">
          <div class="question-text mb-2" for="image">
            For the last step, please review & update any of {{ selectedPet.name }}'s
            information that may have changed.
          </div>
          <div class="petFile">
            <Accordion>
              <AccordionTab>
                <template #header>
                  <div
                    class="flex align-items-center gap-2 justify-content-between w-full"
                  >
                    <div class="flex align-items-center gap-2">
                      <div class="pet-image flex-none">
                        <img :src="selectedPet?.image" />
                      </div>
                      <h4 class="m-0">{{ selectedPet?.name }}</h4>
                    </div>
                  </div>
                </template>
                <div class="grid">
                  <Button
                    class="editBtn"
                    @click.prevent="editPetInfo"
                    icon="pi pi-pencil"
                  />
                  <div class="flex flex-column col-12 sm:col-4">
                    <p><span>Type:</span> {{ selectedPet.type.label }}</p>
                    <p><span>Sex:</span> {{ selectedPet.sex }}</p>
                    <p><span>Spayed/Neutered:</span> {{ selectedPet.spayed_neutered }}</p>
                    <p><span>DOB:</span> {{ formatDate(selectedPet.dob) }}</p>
                    <p>
                      <span>Tracking:</span>
                      <ul v-if="selectedPet.tracking" class="my-0">
                        <li v-for="item in selectedPet.tracking">
                          {{ item }}
                        </li>                      
                      </ul>
                      <div v-else class="inline">&nbsp;none</div>
                    </p>
                  </div>
                  <div class="col-12 sm:col-4">
                    <p>
                      <span>Lifestyle:</span>
                      <ul v-if="selectedPet.lifestyles" class="my-0">
                        <li v-for="item in selectedPet.lifestyles">
                          {{ item }}
                        </li>                      
                      </ul>
                      <div v-else class="inline">&nbsp;none</div>
                    </p>
                    <p v-if="isExotic">
                      <span>Aquired:</span> {{ selectedPet.pet_aquired_from }}
                    </p>
                    <p v-if="isExotic">
                      <span>Housing/Enclosure: </span> {{ selectedPet.describe_housing }}
                    </p>
                    <p>
                      <span>Foods/Snacks:</span>
                      <ul v-if="selectedPet.food" class="my-0">
                        <li v-for="item in selectedPet.food">
                          {{ item.product }}: {{ item.times_a_day }}x/day
                        </li>                      
                      </ul>
                      <div v-else class="inline">&nbsp;none</div>
                    </p>
                  </div>
                  <div class="col-12 sm:col-4">
                    <p>
                      <span>Preventatives:</span>
                       <ul v-if="selectedPet.preventatives" class="my-0">
                        <li v-for="item in selectedPet.preventatives">
                          {{ item.product }}
                        </li>                      
                      </ul>
                      <div v-else class="inline">&nbsp;none</div>
                    </p>
                    <p>
                      <span>Medications and/or supplements:</span>
                      <ul v-if="selectedPet.meds.length" class="my-0">
                        <li v-for="item in selectedPet.meds">
                          {{ item.product }}: {{ item.dose }} {{ item.times_a_day }}x/day
                        </li>                      
                      </ul>
                      <div v-else class="inline">&nbsp;none</div>
                    </p>
                    <p>
                      <span>Insurance:</span>
                      {{ selectedPet.has_insurance ? selectedPet.provider : "none" }}
                    </p>
                  </div>

                  <Button
                    label="Edit Pet Info"
                    @click.prevent="editPetInfo"
                    icon="pi pi-pencil"
                  />
                </div>
              </AccordionTab>
            </Accordion>
          </div>
        </div>

        <Button type="submit" label="Submit" />
      </div>
    </form>

    <pre v-if="selectedPet">{{ selectedPet }}</pre>
  </section>
</template>

<style lang="scss" scoped>
.todays-visit {
  .header {
    background-color: var(--bg-grey);
    border: 1px solid var(--stroke);
    border-radius: 0.5rem;
    padding: 0.25rem 1rem;
  }
  .pet-image {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .petFile {
    position: relative;
    p {
      margin: 0;
      font-weight: bold;
      span {
        font-weight: normal;
      }
    }
    .editBtn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 1;
    }
  }
}
</style>
<style lang="scss">
.todays-visit {
  .p-fileupload {
    button[data-pc-section="uploadbutton"],
    button[data-pc-section="cancelbutton"] {
      display: none !important;
    }
    .limit {
      background: none;
      border: none;
      box-shadow: none !important;
      svg {
        display: none;
      }
    }
  }
  .p-fileupload-file-details {
    display: none !important;
  }
  .p-fileupload-file-thumbnail {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
  }
}
</style>
