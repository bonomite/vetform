<script setup>
import { useCurrentPetProfileStep } from '~/composables/states.ts'
import { lifestyles } from '~/composables/globals.ts'
const currentPetProfileStep = useCurrentPetProfileStep()
definePageMeta({
  layout: 'pet',
})

onBeforeMount(async () => {
  currentPetProfileStep.value = 1
})

const selectedKLifestyles = ref([])
</script>
<template>
  <div class="pet-profile">
    <section class="question your-pet">
      <h1>Your pet’s lifestyle</h1>

      <div class="card flex justify-content-center">
        <div class="grid">
          <div
            v-for="lifestyle of lifestyles"
            :key="lifestyle.key"
            class="flex align-items-center col-6"
          >
            <Checkbox
              v-model="selectedKLifestyles"
              :inputId="lifestyle.key"
              name="lifestyle"
              :value="lifestyle.label"
            />
            <label :for="lifestyle.key" class="ml-2"
              >{{ lifestyle.label }}
            </label>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
