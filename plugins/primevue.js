import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Steps from 'primevue/steps'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(PrimeVue, { ripple: true })
	nuxtApp.vueApp.use(ToastService)
	nuxtApp.vueApp.component('Button', Button)
	nuxtApp.vueApp.component('InputText', InputText)
	nuxtApp.vueApp.component('InputMask', InputMask)
	nuxtApp.vueApp.component('Steps', Steps)
	nuxtApp.vueApp.component('Toast', Toast)
	nuxtApp.vueApp.component('ToastService', ToastService)
	//other components that you need
})
