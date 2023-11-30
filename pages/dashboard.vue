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
  <h1>Dashboard</h1>
  <Button label="logout" @click="logUserOut" />

  <h3>my pets</h3>
  <pre>{{ myPets }}</pre>
</template>
