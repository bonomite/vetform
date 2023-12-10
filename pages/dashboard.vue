<script setup>
import {
  useCurrentUser,
  useCurrentUserProfile,
  useSelectedPet,
} from "~/composables/states.ts"
import { logUserOut, formatPhoneNumber } from "~/utils/helpers.js"
definePageMeta({
  middleware: "authorized",
})

const currentUser = useCurrentUser()
const currentUserProfile = useCurrentUserProfile()
const selectedPet = useSelectedPet()
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
// init clear selected pet
selectedPet.value = null

const petSelected = (pet) => {
  console.log("petSelected = ", pet)
  // set a global var for the selected pet
  selectedPet.value = pet
  navigateTo({
    path: "/todays-visit",
    query: {
      petuid: pet.uid,
    },
  })
}
//console.log("useCurrentUser = ", currentUser)
//console.log("currentUserProfile = ", currentUserProfile)
</script>

<template>
  <section class="dashboard">
    <div class="user-header flex justify-content-between align-items-center">
      <div class="left flex align-items-center gap-2">
        <Button icon="pi pi-user-edit" rounded @click="editUser" />
        <h4 v-if="currentUserProfile && currentUser?.phone && myPets">
          {{ currentUserProfile?.first_name }} {{ currentUserProfile?.last_name }} |
          {{ formatPhoneNumber(currentUser?.phone) }} | {{ currentUserProfile?.email }}
        </h4>
      </div>

      <Button icon="pi pi-sign-out" rounded @click="logUserOut" />
    </div>
    <h3>Let's get started with today's visit! Select the pet we are seeing today?</h3>
    <div class="flex gap-3 flex-wrap">
      <Button
        v-for="pet in myPets"
        :key="pet.uid"
        class="flex gap-3 py-1 pet"
        @click="petSelected(pet)"
      >
        <NuxtImg :src="pet.image" />
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
