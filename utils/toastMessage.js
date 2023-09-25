export function toastMessage(type, phone = null) {
	let toastObject = {
		life: 3000,
	}

	switch (type) {
		case "profile_saved":
			toastObject.severity = 'success'
			toastObject.summary = 'Profile saved'
			toastObject.detail= 'Your profile information has been saved.'
		break;
		case "database_error":
			toastObject.severity = 'danger'
			toastObject.summary = 'Database error'
			toastObject.detail= 'An error occured, please try again.'
		break;
		case "phone_auth_failed":
			toastObject.severity = 'danger'
			toastObject.summary = 'Authentication failed'
			toastObject.detail= 'Please enter a valid phone number and try again.'
		break;
		case "sms_code_failed":
			toastObject.severity = 'danger'
			toastObject.summary = 'Verification failed'
			toastObject.detail= 'Code verification failed. Please try again.'
		break;
		case "sms_code_sent":
			toastObject.severity = 'success'
			toastObject.summary = 'Authentication'
			toastObject.detail= `Verification code sent to ${phone}`
		break;
	}

	return toastObject
}