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

export const scrollToFirstValidationError = async () => {
    await nextTick()
    const elm = document.getElementsByClassName('p-error')[0]
    elm.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
    })
}