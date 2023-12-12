import { email, helpers, minLength, required } from '@vuelidate/validators'
const phoneNumberRegEx = helpers.regex(/^\(\d{3}\) \d{3}-\d{4}$/)

export function validatePhone() {
	return {
		required: helpers.withMessage(
			"The phone number field is required",
			required
		),
		phoneNumberRegEx,
	}
}
export function validateEmail() {
	return {
		email: helpers.withMessage('Invalid email format', email),
		required: helpers.withMessage('The email field is required', required),
	}
}
export function validateRequired(message) {
	return {
		required: helpers.withMessage(message, required),
	}
}