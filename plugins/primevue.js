import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Checkbox from 'primevue/checkbox'
import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import InputNumber from 'primevue/inputnumber'
import RadioButton from 'primevue/radiobutton'
import SelectButton from 'primevue/selectbutton'
import Steps from 'primevue/steps'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(PrimeVue, { ripple: true })
	nuxtApp.vueApp.use(ToastService)
	nuxtApp.vueApp.component('Button', Button)
	nuxtApp.vueApp.component('Calendar', Calendar)
	nuxtApp.vueApp.component('Checkbox', Checkbox)
	nuxtApp.vueApp.component('Dropdown', Dropdown)
	nuxtApp.vueApp.component('FileUpload', FileUpload)
	nuxtApp.vueApp.component('InputText', InputText)
	nuxtApp.vueApp.component('InputMask', InputMask)
	nuxtApp.vueApp.component('InputNumber', InputNumber)
	nuxtApp.vueApp.component('RadioButton', RadioButton)
	nuxtApp.vueApp.component('SelectButton', SelectButton)
	nuxtApp.vueApp.component('Steps', Steps)
	nuxtApp.vueApp.component('Textarea', Textarea)
	nuxtApp.vueApp.component('Toast', Toast)
	nuxtApp.vueApp.component('ToastService', ToastService)
	//other components that you need
})
