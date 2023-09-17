const currentUser = null
// global state for the current authorized user
export const useCurrentUser = () => useState('useCurrentUser', () => currentUser)

const currentUserProfile = null
// global state for the current authorized user's profile
export const useCurrentUserProfile = () => useState('useCurrentUserProfile', () => currentUserProfile)