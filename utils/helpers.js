import { ref } from 'vue'
import { usePetProfileData } from '~/composables/states.ts'
import { petOptions } from '~/composables/globals.ts'

export const getName = computed(() => {
    const petProfileData = ref(usePetProfileData().value)
    return petProfileData.value.name ? petProfileData.value.name : 'your pet'
})

export const isExotic = () => {
    const petProfileData = ref(usePetProfileData().value)
    return petProfileData.value.type
        ? petOptions.find((item) => item.label === petProfileData.value.type.label)
            .exotic
        : false
}