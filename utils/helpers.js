import { ref } from 'vue'
import {
    usePetProfileData, useCurrentUser, useCurrentUserProfile
} from '~/composables/states.ts'
import { PETOPTIONS } from '~/utils/globals.ts'


export const getAndSetUserProfile = async () => {

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
            console.error(error)
        }
    }

}

export const getAndSetCurrentPetProfile = () => {
    const ls = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME))
    const petProfileData = usePetProfileData()
    petProfileData.value = ls
    return petProfileData.value
}

export const getName = computed(() => {
    const petProfileData = ref(usePetProfileData().value)
    return petProfileData.value.name ?? 'your pet'

})

export const isExotic = computed(() => {
    const petProfileData = ref(usePetProfileData().value)
    return petProfileData.value.type
        ? PETOPTIONS.find((item) => item.label === petProfileData.value.type.label)
            .exotic
        : false
})

export const scrollToFirstValidationError = async () => {
    await nextTick()
    const elm = document.getElementsByClassName('p-error')[0]
    elm.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
    })
}

export const isLast = (index, arr) => {
    if (index === arr.length - 1) {
        return true
    }
    return false
}