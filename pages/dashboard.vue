<script setup>
import { useCurrentUser, useCurrentUserProfile } from '~/composables/states.ts'
const currentUser = useCurrentUser()
const currentUserProfile = useCurrentUserProfile()
const client = useSupabaseClient()
// actions to be taken with the log out button is clicked
const onLogOut = async () => {
  // sign out from supabase
  await client.auth.signOut()

  // set the currentUser composable to null
  currentUser.value = null

  // reset the currentEpisode composable to the default
  currentUserProfile.value = null
  navigateTo('/login')
}
</script>

<template>
  <h1>Dashboard</h1>
  <Button label="logout" @click="onLogOut" />
</template>
