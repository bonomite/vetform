import { ref } from 'vue'
import { usePetProfileData } from '~/composables/states.ts'
export const savePetFormData = (formData) => {
    const petProfileData = ref(usePetProfileData().value)
    // update browser local storage for pet profile
    localStorage.setItem(
        'myPetProfileFormData',
        JSON.stringify(petProfileData.value)
    )
    //update global state for pet profile
    petProfileData.value = {
        ...formData,
    }
}