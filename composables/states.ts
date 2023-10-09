const currentUser = null
// global state for the current authorized user
export const useCurrentUser = () => useState('useCurrentUser', () => currentUser)

const currentUserProfile = null
// global state for the current authorized user's profile
export const useCurrentUserProfile = () => useState('useCurrentUserProfile', () => currentUserProfile)

// global state for the current pet form steps
export const useCurrentPetProfileStep = () => useState('useCurrentPetProfileStep', () => 0)

// global state pet-profile data
export const usePetProfileData = () => useState('usePetProfileData', () => ({
    name: null,
    type: null,
    sex: null,
    spayed_neutered: null,
    dob: null,
    tracking: null,
    lifestyles: null,
    lifestyles_other: null,
    household_less_than_6_months: null,
    pet_aquired_from: null,
    describe_housing: null,
    food: null,
    grain_free: null,
}))