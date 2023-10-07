import { usePetProfileData } from '~/composables/states.ts'
const petProfileData = usePetProfileData()
export const savePetFormData = (formData) => {
    //update global state for pet profile
    petProfileData.value = {
        ...formData,
    }
    // update browser local storage for pet profile
    localStorage.setItem(
        'myPetProfileFormData',
        JSON.stringify(petProfileData.value)
    )
}