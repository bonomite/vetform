const currentUser = null
// global state for the current authorized user
export const useCurrentUser = () => useState('useCurrentUser', () => currentUser)

const currentUserProfile = null
// global state for the current authorized user's profile
export const useCurrentUserProfile = () => useState('useCurrentUserProfile', () => currentUserProfile)

// global state for the current pet form steps
export const useCurrentPetProfileStep = () => useState('useCurrentPetProfileStep', () => 0)

// global state pet-profile data
export const usePetProfileData = () => useState('usePetProfileData', () => null)