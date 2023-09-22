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

                // update supabase profile data
                // set the supabase prferences with what is currently set in the local storage
                // await client
                //     .from('profiles')
                //     .update({
                //         initialized: false,
                //     })
                //     .match({ id: currentUser.value.id })
            } else {
                if (data.first_name) {
                    navigateTo('/pet-profile')
                } else {
                    navigateTo('/client-profile')
                }

            }

        }
    }
    // function that gets a user profile
    const getProfile2 = async () => {
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

                // update supabase profile data
                // set the supabase prferences with what is currently set in the local storage
                // await client
                //     .from('profiles')
                //     .update({
                //         initialized: false,
                //     })
                //     .match({ id: currentUser.value.id })
            } else {
                if (data.first_name) {
                    navigateTo('/pet-profile')
                } else {
                    navigateTo('/client-profile')
                }

            }

        }
    }


    // check local storage for the auth token
    if (process.client) {
        console.log('user', user)
        // check supabase session for logged in user
        if (user?.data?.session?.user) {
            currentUser.value = user?.data?.session?.user
            getProfile()
        } else {
            //navigateTo('/login')
            window.location.href = '/login'
        }
    }

})