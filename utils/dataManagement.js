import { reactive } from 'vue'
import { usePetProfileData } from '~/composables/states.ts'
import { LOCAL_STORAGE_NAME } from '~/utils/globals.ts'
import { useCurrentUser, useCurrentUserProfile } from '~/composables/states.ts'
import { ynToBoolean, randomUID } from '~/utils/helpers.js'





export const savePetFormData = async (formData, submit = false) => {
    const petProfileData = reactive(usePetProfileData())
    //update global state for pet profile
    petProfileData.value = { ...petProfileData.value, ...formData }
    // update browser local storage for pet profile
    localStorage.setItem(
        LOCAL_STORAGE_NAME,
        JSON.stringify(petProfileData.value)
    )

    if (submit) {
        // submit form to supabase 
        //uid
        const uid = randomUID()
        petProfileData.value.uid = uid
        //owner_id
        const currentUser = useCurrentUser()
        petProfileData.value.owner_id = currentUser.value.id
        //name
        //sex
        //spayed_neutered (boolean)
        petProfileData.value.spayed_neutered = ynToBoolean(petProfileData.value.spayed_neutered)
        //dob (timestamptz)
        //tracking (jsonb)
        //image
        // convert the base64 image to a file and use Supabase storage api to upload and get back a URL we can store in the table
        const imageFile = base64ToFile(petProfileData.value.image, uid)
        await uploadPetPhoto(imageFile.file, `${uid}.${imageFile.ext}`)
        petProfileData.value.image = await getPublicUrl(`${uid}.${imageFile.ext}`)
        //lifestyles (jsonb) push lifestyles_other to lifestyles array
        petProfileData.value.lifestyles.push(petProfileData.value.lifestyles_other)
        // household_less_than_6_months (boolean)
        petProfileData.value.household_less_than_6_months = ynToBoolean(petProfileData.value.household_less_than_6_months)
        //pet_aquired_from
        //describe_housing
        //food (jsonb)
        //grain_free (boolean)
        petProfileData.value.grain_free = ynToBoolean(petProfileData.value.grain_free)
        //preventatives (jsonb)
        //preventatives_other (jsonb) save only the selected preventatives to supabase
        petProfileData.value.preventatives = petProfileData.value.preventatives.filter(item => item.checked)
        //meds (jsonb)
        //has_insurance (boolean)
        petProfileData.value.has_insurance = ynToBoolean(petProfileData.value.has_insurance)
        //provider just save the label string
        petProfileData.value.provider = petProfileData.value.provider.label
        // other_hospitals (boolean)
        petProfileData.value.other_hospitals = ynToBoolean(petProfileData.value.other_hospitals)
        //other_hospital_name
        //other_hospital_visit (timestamptz)
        // type (jsonb)

        console.log('petProfileData.value = ', petProfileData.value)

        //clear local storage if supabase update is successful
        //localStorage.removeItem(LOCAL_STORAGE_NAME)

        // clear petProfileData state if supabase update is successful
        //petProfileData.value = PET_OBJECT_MODEL

    }
}
