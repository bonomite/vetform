import { reactive } from 'vue'
import { usePetProfileData } from '~/composables/states.ts'

export const savePetFormData = (formData) => {
    const petProfileData = reactive(usePetProfileData().value)
    //update global state for pet profile
    Object.assign(petProfileData, formData)
    // update browser local storage for pet profile
    localStorage.setItem(
        'myPetProfileFormData',
        JSON.stringify(petProfileData)
    )
}
