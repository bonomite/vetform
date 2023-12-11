import { ref } from 'vue'
import {
    usePetProfileData, useCurrentUser, useCurrentUserProfile
} from '~/composables/states.ts'
import { PETOPTIONS, NOYESOPTIONS, PETIMAGEBUCKET } from '~/utils/globals.ts'


export const getAndSetUserProfile = async () => {

    const currentUser = useCurrentUser()
    const currentUserProfile = useCurrentUserProfile()
    const config = useRuntimeConfig()
    const client = useSupabaseClient()
    const user = await client.auth.getSession()
    //console.log('currentUser', currentUser)
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
            console.log(error)
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
            console.log('logged out')
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

export const ynToBoolean = (value) => {
    if (value === NOYESOPTIONS[0]) {
        return true
    }
    return false
}

export const uploadPetPhoto = async (file, filename) => {
    const client = useSupabaseClient()
    const { data, error } = await client.storage.from(PETIMAGEBUCKET).upload(filename, file)
    if (error) {
        // Handle error
        console.log('image data upload failed', error)
    } else {
        // Handle success
        console.log('image data success', data)

    }
}

export const getPublicUrl = async (filename) => {
    const client = useSupabaseClient()
    const { data, error } = await client.storage.from(PETIMAGEBUCKET).getPublicUrl(filename)

    if (error) {
        console.error('Error getting public URL: ', error)
    } else {
        console.log('data = ', data)
        return data.publicUrl
    }
}

export const base64ToFile = (base64, filename) => {
    var arr = base64.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return { file: new File([u8arr], filename, { type: mime }), ext: mime.replace('image/', '') }
}

export const randomUID = function (length = 12) {
    return Math.random().toString(36).substring(2, length + 2)
}

export const logUserOut = async () => {
    //console.log('logout')
    const client = useSupabaseClient()
    const currentUser = useCurrentUser()
    const currentUserProfile = useCurrentUserProfile()
    // sign out from supabase
    await client.auth.signOut()

    // set the currentUser composable to null
    currentUser.value = null

    // reset the currentEpisode composable to the default
    currentUserProfile.value = null
    navigateTo("/login")
}

const extractFilename = (url) => {
    const urlObj = new URL(url)
    const pathSegments = urlObj.pathname.split('/')
    return pathSegments[pathSegments.length - 1]
}

export const handleImage = async (url, options, bucket = "petphotos") => {
    const filename = extractFilename(url)
    console.log('filename = ', filename)
    const client = useSupabaseClient()
    const newUrl =
        await client.storage.from(bucket).getPublicUrl(filename, {
            transform: {
                width: options?.width ?? null,
                height: options?.height ?? null,
                quality: options?.quality ?? 75,
                resize: options?.resize ?? 'cover',
                format: options?.origin ?? null,
            },
        })
    console.log('newUrl = ', newUrl.data.publicUrl)
    return url
    //return newUrl.data.publicUrl

}

export const formatPhoneNumber = (phoneNumberString) => {
    //console.log('phoneNumberString= ', phoneNumberString)

    // Remove "1" from the beginning if it exists
    if (phoneNumberString.charAt(0) === '1') {
        phoneNumberString = phoneNumberString.substring(1)
    }
    // Remove any non-numeric characters
    let cleaned = phoneNumberString.replace(/\D/g, '')

    // Insert hyphens at the appropriate positions
    let formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')

    return formatted
}