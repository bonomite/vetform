import {
    useSelectedPet
} from '~/composables/states'
export default defineNuxtRouteMiddleware((to, from) => {

    const selectedPet = useSelectedPet()
    const client = useSupabaseClient()

    // function that gets a user profile
    const getPetProfile = async () => {
        const { data, error } = await client
            .from("pets")
            .select("*")
            .eq("uid", to.query.petuid)
        if (error) {
            console.error(error)
        } else {
            selectedPet.value = data[0]
        }
    }

    getPetProfile()

})