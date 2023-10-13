import { reactive } from 'vue'
import { usePetProfileData } from '~/composables/states.ts'

export const savePetFormData = (formData) => {
    const petProfileData = reactive(usePetProfileData())
    //update global state for pet profile
    petProfileData.value = { ...petProfileData.value, ...formData }

    // update browser local storage for pet profile
    localStorage.setItem(
        'myPetProfileFormData',
        JSON.stringify(petProfileData.value)
    )
}
