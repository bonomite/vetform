import { ref } from 'vue'
import { usePetProfileData } from '~/composables/states.ts'
import { PETOPTIONS } from '~/utils/globals.ts'

export const getName = computed(() => {
    const petProfileData = ref(usePetProfileData().value)
    return petProfileData.value.name ?? 'your pet'

})

export const isExotic = computed(() => {
    const petProfileData = ref(usePetProfileData().value)
    return petProfileData.value.type
        ? PETOPTIONS.find((item) => item.label === petProfileData.value.type.label)
            .exotic
        : false
})

export const scrollToFirstValidationError = async () => {
    await nextTick()
    const elm = document.getElementsByClassName('p-error')[0]
    elm.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
    })
}

export const isLast = (index, arr) => {
    if (index === arr.length - 1) {
        return true
    }
    return false
}