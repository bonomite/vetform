import {
    useCurrentUser,
    useCurrentUserProfile,
} from '~/composables/states'
export default defineNuxtRouteMiddleware(async () => {
    const currentUser = useCurrentUser()
    const currentUserProfile = useCurrentUserProfile()
    const config = useRuntimeConfig()
    const client = useSupabaseClient()
    const user = await client.auth.getSession()
    console.log('currentUser', currentUser)
    // function that gets a user profile
    const getProfile = async () => {
        const {
            data,
            error
        } = await client
            .from('profiles')
            .select('*')
            .eq('id', currentUser.value.id)
            .single()
        if (error) {
            console.error(error)
        } else if (data) {
            // set the current user profile state
            currentUserProfile.value = data
            if (data.initialized) {
                navigateTo('/dashboard')
            } else {
                if (!data.first_name) {
                    navigateTo('/client-profile')
                } else {
                    navigateTo('/pet-profile')
                }
            }
        }
    }

    // check local storage for the auth token
    if (process.client) {
        //console.log('user', user)
        // check supabase session for logged in user
        if (user?.data?.session?.user) {
            currentUser.value = user?.data?.session?.user
            getProfile()
        } else {
            return navigateTo('/login')
        }
    }

})