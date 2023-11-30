<script setup>
import { useCurrentUser, useCurrentUserProfile } from "~/composables/states.ts"
import { logUserOut, formatPhoneNumber } from "~/utils/helpers.js"
definePageMeta({
  middleware: "authorized",
})

const currentUser = useCurrentUser()
const currentUserProfile = useCurrentUserProfile()
const client = useSupabaseClient()
const user = await client.auth.getSession()

const myPets = ref(null)

const { data, error } = await client
  .from("pets")
  .select("*")
  .eq("owner_id", user?.data?.session?.user.id)
if (error) {
  console.error(error)
} else {
  myPets.value = data
}
console.log("useCurrentUser = ", currentUser)
console.log("currentUserProfile = ", currentUserProfile)
</script>

<template>
  <section class="dashboard">
    <h2 v-if="currentUserProfile && currentUser">
      {{ currentUserProfile?.first_name }} {{ currentUserProfile?.last_name }} |
      {{ formatPhoneNumber(currentUser?.phone) }} | {{ currentUserProfile?.email }}
    </h2>

    <Button label="logout" icon="pi pi-sign-out" iconPos="right" @click="logUserOut" />

    <h3>Let's get started with today's visit! Select the pet we are seeing today?</h3>
    <div class="flex gap-3">
      <div v-for="pet in myPets" class="pet" :key="pet.uid">
        <Button class="flex gap-3 py-1">
          <img :src="pet.image" />
          <h4>{{ pet.name }}</h4>
          <i class="pi pi-chevron-right"></i>
          <!-- pi-check -->
        </Button>

        <!-- <img
        :src="
          handleImage(pet.image, {
            width: 100,
            height: 100,
            quality: 50,
            resize: 'cover',
          })
        "
      />
      <img :src="handleImage(pet.image)" /> -->
      </div>
    </div>
    <Button
      class="mt-8"
      label="Add another pet"
      icon="pi pi-plus"
      @click="navigateTo('/pet-profile')"
    />
    <!--     <pre class="text-xs">{{ myPets }}</pre> -->
  </section>
</template>

<style lang="scss" scoped>
.dashboard {
  .pet {
    img {
      border-radius: 50%;
      width: 50px;
      height: 50px;
      object-fit: cover;
      overflow: hidden;
    }
  }
}
</style>
