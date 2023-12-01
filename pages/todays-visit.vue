<script lang="ts" setup>
import {
  useCurrentUser,
  useCurrentUserProfile,
  useSelectedPet,
} from "~/composables/states.ts"

const currentUser = useCurrentUser()
const currentUserProfile = useCurrentUserProfile()
const selectedPet = useSelectedPet()
</script>
<template>
  <section>
    <h1>Today's Visit</h1>
    <Button label="back" icon="pi pi-chevron-left" @click="navigateTo('/dashboard')" />
    <pre>{{ selectedPet }}</pre>
  </section>
</template>

<style></style>
