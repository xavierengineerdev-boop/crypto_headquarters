import { parsePhoneNumber, type CountryCode } from 'libphonenumber-js'
import { isValidPhoneNumber, isPossiblePhoneNumber } from 'react-phone-number-input'

export interface PhoneValidationRules {
	country: CountryCode
	maxLength: number
	minLength: number
	canBeValid: (phone: string) => boolean
	isValid: (phone: string) => boolean
}

export const getPhoneValidationRules = (country: CountryCode | undefined): PhoneValidationRules | null => {
	if (!country) return null

	return {
		country,
		maxLength: getMaxLengthForCountry(country),
		minLength: getMinLengthForCountry(country),
		canBeValid: (phone: string) => isPossiblePhoneNumber(phone, country),
		isValid: (phone: string) => isValidPhoneNumber(phone, country),
	}
}

const getMaxLengthForCountry = (country: CountryCode): number => {
	try {
		const countryMaxLengths: Partial<Record<CountryCode, number>> = {
			UA: 9,
			RU: 10,
			KZ: 10,
			US: 10,
			GB: 10,
			DE: 11,
			FR: 9,
			IT: 10,
			ES: 9,
			PL: 9,
			CN: 11,
			IN: 10,
			BR: 11,
			JP: 10,
		}

		if (countryMaxLengths[country]) {
			return countryMaxLengths[country]!
		}

		return 15
	} catch {
		return 15
	}
}

const getMinLengthForCountry = (country: CountryCode): number => {
	try {
		const countryMinLengths: Partial<Record<CountryCode, number>> = {
			UA: 9,
			RU: 10,
			KZ: 10,
			US: 10,
			GB: 10,
			DE: 10,
			FR: 9,
			IT: 9,
			ES: 9,
			PL: 9,
		}

		if (countryMinLengths[country]) {
			return countryMinLengths[country]!
		}

		return 7
	} catch {
		return 7
	}
}

export const canAddMoreDigits = (phone: string, country: CountryCode | undefined): boolean => {
	if (!country || !phone) return true

	const rules = getPhoneValidationRules(country)
	if (!rules) return true

	return rules.canBeValid(phone)
}

export const exceedsMaxLength = (phone: string, country: CountryCode | undefined): boolean => {
	if (!country || !phone) return false

	try {
		const phoneNumber = parsePhoneNumber(phone, country)
		if (!phoneNumber) return false

		const rules = getPhoneValidationRules(country)
		if (!rules) return false

		const nationalNumberLength = phoneNumber.nationalNumber.length
		return nationalNumberLength > rules.maxLength
	} catch {
		return !isPossiblePhoneNumber(phone, country)
	}
}

export const validatePhoneNumber = (
	phone: string,
	country: CountryCode | undefined
): { isValid: boolean; canBeValid: boolean; error?: string } => {
	if (!phone) {
		return { isValid: false, canBeValid: false, error: 'Номер телефона не введен' }
	}

	if (!country) {
		const isValid = isValidPhoneNumber(phone)
		return { isValid, canBeValid: isValid }
	}

	const rules = getPhoneValidationRules(country)
	if (!rules) {
		return { isValid: false, canBeValid: false, error: 'Страна не определена' }
	}

	try {
		const phoneNumber = parsePhoneNumber(phone, country)
		if (phoneNumber) {
			const nationalNumberLength = phoneNumber.nationalNumber.length
			
			if (nationalNumberLength < rules.minLength) {
				return {
					isValid: false,
					canBeValid: true,
					error: 'Номер неполный',
				}
			}
			
			if (nationalNumberLength > rules.maxLength) {
				return {
					isValid: false,
					canBeValid: false,
					error: `Номер превысил максимальную длину для ${country}`,
				}
			}
		}
	} catch {
	}

	const canBeValid = rules.canBeValid(phone)
	const isValid = rules.isValid(phone)

	if (!canBeValid) {
		return {
			isValid: false,
			canBeValid: false,
			error: `Номер превысил максимальную длину для ${country}`,
		}
	}

	if (!isValid) {
		return {
			isValid: false,
			canBeValid: true,
			error: 'Номер неполный или некорректный',
		}
	}

	return { isValid: true, canBeValid: true }
}

