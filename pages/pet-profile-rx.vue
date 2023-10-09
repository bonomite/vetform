<script setup>
import { usePetProfileData } from '~/composables/states.ts'
definePageMeta({
  layout: 'pet',
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
