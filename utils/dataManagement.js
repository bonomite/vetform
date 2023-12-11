import { reactive } from 'vue'
import { useCurrentUser, useCurrentUserProfile, usePetProfileData, useVisitData } from '~/composables/states.ts'
import { PET_LOCAL_STORAGE_NAME, VISIT_LOCAL_STORAGE_NAME, PET_OBJECT_MODEL, VISIT_OBJECT_MODEL } from '~/utils/globals.ts'
import { ynToBoolean, randomUID } from '~/utils/helpers.js'

export const savePetFormData = async (formData, submit = false) => {
    const petProfileData = reactive(usePetProfileData())
    //update global state for pet profile
    petProfileData.value = { ...petProfileData.value, ...formData }
    // update browser local storage for pet profile

    if (!submit) {
        localStorage.setItem(
            PET_LOCAL_STORAGE_NAME,
            JSON.stringify(petProfileData.value)
        )
    } else {
        // submit form to supabase 
        const client = useSupabaseClient()
        const currentUser = useCurrentUser()

        const uid = randomUID()

        //image
        // convert the base64 image to a file and use Supabase storage api to upload and get back a URL we can store in the table
        const imageFile = base64ToFile(petProfileData.value.image, uid)
        await uploadPetPhoto(imageFile.file, `${uid}.${imageFile.ext}`)
        const publicImageUrl = await getPublicUrl(`${uid}.${imageFile.ext}`)

        console.log('petProfileData.value = ', petProfileData.value)
        const { error } = await client
            .from("pets")
            .upsert({
                owner_id: currentUser.value.id,
                name: petProfileData.value.name,
                sex: petProfileData.value.sex,
                spayed_neutered: ynToBoolean(petProfileData.value.spayed_neutered),
                dob: petProfileData.value.dob,
                tracking: petProfileData.value.tracking,
                image: publicImageUrl,
                lifestyles: petProfileData.value.lifestyles && petProfileData.value.lifestyles_other ? petProfileData.value.lifestyles.concat(petProfileData.value.lifestyles_other) : null,
                lifestyles_other: petProfileData.value.lifestyles_other,
                household_less_than_6_months: ynToBoolean(petProfileData.value.household_less_than_6_months),
                pet_aquired_from: petProfileData.value.pet_aquired_from,
                describe_housing: petProfileData.value.describe_housing,
                food: petProfileData.value.food,
                grain_free: ynToBoolean(petProfileData.value.grain_free),
                preventatives: petProfileData.value.preventatives.filter(item => item.checked),
                meds: petProfileData.value.meds,
                has_insurance: ynToBoolean(petProfileData.value.has_insurance),
                provider: petProfileData.value.provider?.label,
                other_hospitals: ynToBoolean(petProfileData.value.other_hospitals),
                other_hospital_name: petProfileData.value.other_hospital_name,
                other_hospital_visit: petProfileData.value.other_hospital_visit,
                type: petProfileData.value.type,
                uid: uid,
                updated_at: new Date().toISOString(),
            })
        //   If Supabase errors
        if (error) {
            console.log('error = ', error)
            //   If Supabase is successful
        } else {
            // set user profile initialized to true
            currentUser.value = await client.auth.getSession()
            const { error } = await client
                .from("profiles")
                .update({
                    initialized: true,
                })
                .eq("id", currentUser.value.data.session.user.id)
            //   If Supabase errors
            if (error) {
                console.log('update user profile error = ', error)
            } else {
                console.log('update user profile success')
            }

            //clear local storage if supabase update is successful
            localStorage.removeItem(PET_LOCAL_STORAGE_NAME)

            // clear petProfileData state if supabase update is successful
            petProfileData.value = PET_OBJECT_MODEL

            //navigate to dashboard
            navigateTo("/dashboard")
        }
    }
}

export const saveVisitFormData = async (formData) => {
    const visitData = reactive(useVisitData())
    //update global state for pet profile
    visitData.value = { ...visitData.value, ...formData }
    // update browser local storage for pet profile

    // localStorage.setItem(
    //     VISIT_LOCAL_STORAGE_NAME,
    //     JSON.stringify(visitData.value)
    // )

    // submit form to supabase 
    const client = useSupabaseClient()
    const currentUser = useCurrentUser()

    const uid = randomUID()

    //image
    // convert the base64 image to a file and use Supabase storage api to upload and get back a URL we can store in the table
    // const imageFile = base64ToFile(visitData.value.image, uid)
    // await uploadPetPhoto(imageFile.file, `${uid}.${imageFile.ext}`)
    // const publicImageUrls = await getPublicUrl(`${uid}.${imageFile.ext}`)

    console.log('visitData.value = ', visitData.value)
    // const { error } = await client
    //     .from("visits")
    //     .upsert({
    //         pet_id: uid,
    //         owner_id: currentUser.value.id,
    //         refills: ynToBoolean(visitData.value.refills),
    //         skin_lesions: ynToBoolean(visitData.value.skin_lesions),
    //         skin_lesions_coordinates: visitData.value.skin_lesions_coordinates,
    //         images: publicImageUrls,
    //         preventatives: visitData.value.preventatives.filter(item => item.checked),
    //         updated_at: new Date().toISOString(),
    //     })
    // //   If Supabase errors
    // if (error) {
    //     console.log('error = ', error)
    //     //   If Supabase is successful
    // } else {

    //     //clear local storage if supabase update is successful
    //     localStorage.removeItem(VISIT_LOCAL_STORAGE_NAME)

    //     // clear visitData state if supabase update is successful
    //     visitData.value = VISIT_OBJECT_MODEL

    //     // what to do now?

    // }

}
