import { reactive } from 'vue'
const currentUser = null
// global state for the current authorized user
export const useCurrentUser = () => useState('useCurrentUser', () => currentUser)

const currentUserProfile = null
// global state for the current authorized user's profile
export const useCurrentUserProfile = () => useState('useCurrentUserProfile', () => currentUserProfile)

// global state for the current pet form steps
export const useCurrentPetProfileStep = () => useState('useCurrentPetProfileStep', () => 0)

// global state pet-profile data
export const usePetProfileData = () => useState('usePetProfileData', () => PET_OBJECT_MODEL)

// global state pet-profile data
export const useVisitData = () => useState('useVisitData', () => VISIT_OBJECT_MODEL)

// global state selected pet data
export const useSelectedPet = () => useState('useSelectedPet', () => null)

// if (process.client) {
//     // initially sets the pet profile data from local storage if it exists
//     const localFormData = JSON.parse(localStorage.getItem(PET_LOCAL_STORAGE_NAME))

//     const petProfileData = reactive(usePetProfileData())

//     if (localFormData) {
//         petProfileData.value = localFormData
//     }
// }