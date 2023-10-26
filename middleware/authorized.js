import {
    useCurrentUser,
    useCurrentUserProfile,
} from '~/composables/states'
export default defineNuxtRouteMiddleware(async () => {
    const currentUser = useCurrentUser()
    const currentUserProfile = useCurrentUserProfile()

    const client = useSupabaseClient()
    const user = await client.auth.getSession()
    //console.log('user =', user)
    if (!user?.data?.session?.user) {
        window.location.href = '/'
    }

})