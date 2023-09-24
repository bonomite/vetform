import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import SelectButton from 'primevue/selectbutton';
import Steps from 'primevue/steps'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(PrimeVue, { ripple: true })
	nuxtApp.vueApp.use(ToastService)
	nuxtApp.vueApp.component('Button', Button)
	nuxtApp.vueApp.component('Dropdown', Dropdown)
	nuxtApp.vueApp.component('InputText', InputText)
	nuxtApp.vueApp.component('InputMask', InputMask)
	nuxtApp.vueApp.component('SelectButton', SelectButton)
	nuxtApp.vueApp.component('Steps', Steps)
	nuxtApp.vueApp.component('Toast', Toast)
	nuxtApp.vueApp.component('ToastService', ToastService)
	//other components that you need
})
