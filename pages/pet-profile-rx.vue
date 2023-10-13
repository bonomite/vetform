<script setup>
import {
  usePetProfileData,
  useCurrentPetProfileStep,
} from '~/composables/states.ts'

definePageMeta({
  layout: 'pet',
})
const currentPetProfileStep = useCurrentPetProfileStep()
onBeforeMount(async () => {
  currentPetProfileStep.value = 2
})
const petProfileData = usePetProfileData()

console.log('petProfileData', petProfileData)
</script>
<template>
  <div class="pet-profile">
    <section class="question your-pet">
      <h1>Medications and/or supplements</h1>
    </section>
  </div>
</template>
