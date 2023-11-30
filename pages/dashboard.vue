<script setup>
import { useCurrentUser, useCurrentUserProfile } from "~/composables/states.ts"
import { logUserOut } from "~/utils/helpers.js"
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
</script>

<template>
  <section class="dashboard">
    <h2>{{ currentUserProfile?.first_name }} {{ currentUserProfile?.last_name }}</h2>

    <Button label="logout" @click="logUserOut" />

    <h3>my pets</h3>
    <div v-for="pet in myPets" class="pet" :key="pet.uid">
      <h4>{{ pet.name }}</h4>
      <img :src="pet.image" />
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
    <!--     <pre class="text-xs">{{ myPets }}</pre> -->
  </section>
</template>

<style lang="scss" scoped>
.dashboard {
  .pet {
    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      overflow: hidden;
    }
  }
}
</style>
