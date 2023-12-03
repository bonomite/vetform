<script lang="ts" setup>
import {
  useCurrentUser,
  useCurrentUserProfile,
  useSelectedPet,
} from "~/composables/states.ts"
import { useToast } from "primevue/usetoast"

definePageMeta({
  middleware: "get-selected-pet",
})

const currentUser = useCurrentUser()
const currentUserProfile = useCurrentUserProfile()
const toast = useToast()
const selectedPet = useSelectedPet()
console.log("selectedPet", selectedPet)
</script>
<template>
  <section class="todays-visit">
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

    <pre>{{ selectedPet }}</pre>
  </section>
</template>

<style lang="scss" scoped>
.todays-visit {
  .header {
    background-color: var(--bg-grey);
    border: 1px solid var(--stroke);
    border-radius: 0.5rem;
    padding: 0.25rem 1rem;
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
  }
}
</style>
