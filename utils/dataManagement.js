import { reactive } from 'vue'
import { usePetProfileData } from '~/composables/states.ts'
import { LOCAL_STORAGE_NAME } from '~/utils/globals.ts'

export const savePetFormData = (formData, submit = false) => {
    const petProfileData = reactive(usePetProfileData())
    //update global state for pet profile
    petProfileData.value = { ...petProfileData.value, ...formData }
    // update browser local storage for pet profile
    localStorage.setItem(
        LOCAL_STORAGE_NAME,
        JSON.stringify(petProfileData.value)
    )

    if (submit) {
        // submit form to supabase and clear local storage
        // add users id to "owner_id" column
        // save only the selected preventatives to supabase
        // convert YES NO to Boolean
        // convert the base64 image to a file and use Supabase storage api to upload and get back a URL we can store in the table

    }
}
