import { parsePhoneNumber, type CountryCode } from 'libphonenumber-js'
import { isValidPhoneNumber, isPossiblePhoneNumber } from 'react-phone-number-input'

/**
 * Интерфейс для правил валидации телефона по стране
 */
export interface PhoneValidationRules {
	country: CountryCode
	maxLength: number
	minLength: number
	canBeValid: (phone: string) => boolean
	isValid: (phone: string) => boolean
}

/**
 * Получает правила валидации для конкретной страны
 */
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

/**
 * Получает максимальную длину национального номера для страны
 */
const getMaxLengthForCountry = (country: CountryCode): number => {
	try {
		// Пробуем разные длины для определения максимума
		// Для большинства стран максимум 15 цифр (международный стандарт)
		// Но для каждой страны свой максимум
		
		// Используем известные максимумы для популярных стран
		const countryMaxLengths: Partial<Record<CountryCode, number>> = {
			UA: 9, // Украина: +380 + 9 цифр
			RU: 10, // Россия: +7 + 10 цифр (национальный номер без префиксов +7 или 8)
			KZ: 10, // Казахстан: +7 + 10 цифр (национальный номер без +7, 3 цифры код оператора + 7 цифр номер абонента)
			US: 10, // США: +1 + 10 цифр
			GB: 10, // Великобритания: +44 + 10 цифр
			DE: 11, // Германия: +49 + до 11 цифр
			FR: 9, // Франция: +33 + 9 цифр
			IT: 10, // Италия: +39 + 10 цифр
			ES: 9, // Испания: +34 + 9 цифр
			PL: 9, // Польша: +48 + 9 цифр
			CN: 11, // Китай: +86 + 11 цифр
			IN: 10, // Индия: +91 + 10 цифр
			BR: 11, // Бразилия: +55 + 11 цифр
			JP: 10, // Япония: +81 + 10 цифр
		}

		if (countryMaxLengths[country]) {
			return countryMaxLengths[country]!
		}

		// Если страна не в списке, используем общий максимум
		// Пытаемся определить через parsePhoneNumber
		return 15 // Международный максимум
	} catch {
		return 15
	}
}

/**
 * Получает минимальную длину национального номера для страны
 */
const getMinLengthForCountry = (country: CountryCode): number => {
	try {
		// Минимальные длины для популярных стран
		const countryMinLengths: Partial<Record<CountryCode, number>> = {
			UA: 9, // Украина
			RU: 10, // Россия: национальный номер состоит из 10 цифр
			KZ: 10, // Казахстан: мобильный номер состоит из 10 цифр (3 цифры код оператора + 7 цифр номер абонента)
			US: 10, // США
			GB: 10, // Великобритания
			DE: 10, // Германия
			FR: 9, // Франция
			IT: 9, // Италия
			ES: 9, // Испания
			PL: 9, // Польша
		}

		if (countryMinLengths[country]) {
			return countryMinLengths[country]!
		}

		return 7 // Общий минимум
	} catch {
		return 7
	}
}

/**
 * Проверяет, можно ли ввести еще символы для номера
 */
export const canAddMoreDigits = (phone: string, country: CountryCode | undefined): boolean => {
	if (!country || !phone) return true

	const rules = getPhoneValidationRules(country)
	if (!rules) return true

	// Проверяем через isPossiblePhoneNumber
	return rules.canBeValid(phone)
}

/**
 * Проверяет, превысил ли номер максимальную длину
 */
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
		// Если не удалось распарсить, проверяем через isPossiblePhoneNumber
		return !isPossiblePhoneNumber(phone, country)
	}
}

/**
 * Валидирует номер телефона согласно правилам страны
 */
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

	// Проверяем длину национального номера
	try {
		const phoneNumber = parsePhoneNumber(phone, country)
		if (phoneNumber) {
			const nationalNumberLength = phoneNumber.nationalNumber.length
			
			// Проверяем минимальную длину - номер должен быть полным
			if (nationalNumberLength < rules.minLength) {
				return {
					isValid: false,
					canBeValid: true,
					error: 'Номер неполный',
				}
			}
			
			// Проверяем максимальную длину
			if (nationalNumberLength > rules.maxLength) {
				return {
					isValid: false,
					canBeValid: false,
					error: `Номер превысил максимальную длину для ${country}`,
				}
			}
		}
	} catch {
		// Если не удалось распарсить, продолжаем с обычной проверкой
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

