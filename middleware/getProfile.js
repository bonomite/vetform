import {
    useCurrentUser,
    useCurrentUserProfile,
} from '~/composables/states'
export default defineNuxtRouteMiddleware(async () => {
    const currentUser = useCurrentUser()
    const currentUserProfile = useCurrentUserProfile()

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
            //console.log('currentUserProfile.value', currentUserProfile.value)

        }
    }

    // check local storage for the auth token
    currentUser.value = user?.data?.session?.user
    //console.log('currentUser.value', currentUser.value)
    getProfile()



})