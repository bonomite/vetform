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
}
