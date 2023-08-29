export function convertToE164(phoneNumber, countryCode = '1') {
    // Remove formatting characters
    const cleanedNumber = phoneNumber.replace(/\D/g, '')

    // Add country code and international dialing code
    const e164Number = `+${countryCode}${cleanedNumber}`

    return e164Number
}