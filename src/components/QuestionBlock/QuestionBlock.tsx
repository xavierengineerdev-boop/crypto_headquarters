import { Box, Button, Typography } from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { sendFormData } from '@/api/api'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber, isPossiblePhoneNumber } from 'react-phone-number-input'
import { parsePhoneNumber, type CountryCode } from 'libphonenumber-js'
import { canAddMoreDigits, exceedsMaxLength, validatePhoneNumber, getPhoneValidationRules } from '@/utils/phoneValidation'
import 'react-phone-number-input/style.css'
import { useSuccessOverlay } from '@/App'

const QuestionBlock = () => {
	const [phone, setPhone] = useState<string | undefined>(undefined)
	const [loading, setLoading] = useState(false)
	const [defaultCountry, setDefaultCountry] = useState<string | undefined>(undefined)
	const [isPhoneValid, setIsPhoneValid] = useState(false)
	const phoneInputRef = useRef<HTMLDivElement>(null)
	const { showSuccessOverlay, currentOrderNumber, successOverlayOpen } = useSuccessOverlay()

	// Определение страны по IP (приоритет IP API для работы с VPN)
	useEffect(() => {
		const detectCountry = async () => {
			// Используем несколько API для определения по IP (это работает с VPN)
			const timestamp = Date.now()
			const countryResults: string[] = []

			// API 1: ip-api.com (может возвращать 403 при частых запросах)
			try {
				const response = await fetch(`https://ip-api.com/json/?fields=countryCode&_=${timestamp}`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					},
					cache: 'no-store',
				})
				
				if (response.ok && response.status === 200) {
					const data = await response.json()
					if (data.countryCode) {
						countryResults.push(data.countryCode.toUpperCase())
					}
				}
			} catch (apiError) {
				// Игнорируем ошибку (403, CORS и т.д.)
			}

			// API 2: ipapi.co (может возвращать 429 при частых запросах и CORS ошибки)
			try {
				const response = await fetch(`https://ipapi.co/json/?_=${timestamp}`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					},
					cache: 'no-store',
				})
				if (response.ok && response.status === 200) {
					const data = await response.json()
					if (data.country_code) {
						countryResults.push(data.country_code.toUpperCase())
					}
				}
			} catch (apiError) {
				// Игнорируем ошибку (429, CORS и т.д.)
			}

			// API 3: ipwho.is (более надежный, без лимитов)
			try {
				const response = await fetch(`https://ipwho.is/?_=${timestamp}`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					},
					cache: 'no-store',
				})
				if (response.ok && response.status === 200) {
					const data = await response.json()
					if (data.country_code) {
						countryResults.push(data.country_code.toUpperCase())
					}
				}
			} catch (apiError) {
				// Игнорируем ошибку
			}

			// Выбираем наиболее частый результат
			if (countryResults.length > 0) {
				const countryCounts: Record<string, number> = {}
				countryResults.forEach(country => {
					countryCounts[country] = (countryCounts[country] || 0) + 1
				})

				let maxCount = 0
				let mostCommonCountry = ''
				Object.entries(countryCounts).forEach(([country, count]) => {
					if (count > maxCount) {
						maxCount = count
						mostCommonCountry = country
					}
				})

				if (mostCommonCountry) {
					setDefaultCountry(mostCommonCountry)
					return
				}

				setDefaultCountry(countryResults[0])
				return
			}

			// Если IP API не сработали, пробуем через timezone как запасной вариант
			try {
				const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
				const timezoneToCountry: Record<string, string> = {
					'Europe/Kiev': 'UA',
					'Europe/Kyiv': 'UA',
					'Europe/Moscow': 'RU',
					'Europe/Berlin': 'DE',
					'Europe/Paris': 'FR',
					'Europe/London': 'GB',
					'America/New_York': 'US',
					'America/Los_Angeles': 'US',
					'Europe/Sofia': 'BG',
					'Europe/Warsaw': 'PL',
					'Europe/Rome': 'IT',
					'Europe/Madrid': 'ES',
					'Europe/Amsterdam': 'NL',
					'Europe/Brussels': 'BE',
					'Europe/Prague': 'CZ',
					'Europe/Budapest': 'HU',
					'Europe/Bucharest': 'RO',
					'Europe/Athens': 'GR',
					'Europe/Stockholm': 'SE',
					'Europe/Oslo': 'NO',
					'Europe/Copenhagen': 'DK',
					'Europe/Helsinki': 'FI',
				}
				
				if (timezoneToCountry[timezone]) {
					setDefaultCountry(timezoneToCountry[timezone])
					return
				}
			} catch (tzError) {
				// Игнорируем ошибку
			}

			// Пробуем через Intl API для определения региона
			try {
				const locale = Intl.DateTimeFormat().resolvedOptions().locale
				if (locale) {
					const regionMatch = locale.match(/-([A-Z]{2})$/)
					if (regionMatch && regionMatch[1]) {
						setDefaultCountry(regionMatch[1])
						return
					}
				}
			} catch (e) {
				// Игнорируем ошибку
			}

			// Пробуем через navigator.language как последний вариант
			try {
				const locale = navigator.language || (navigator as any).userLanguage
				if (locale) {
					const parts = locale.split('-')
					if (parts.length > 1) {
						const countryFromLocale = parts[parts.length - 1].toUpperCase()
						if (countryFromLocale.length === 2) {
							setDefaultCountry(countryFromLocale)
							return
						}
					}
				}
			} catch (e) {
				// Игнорируем ошибку
			}
		}

		detectCountry()
	}, [])

	// Блокировка ввода лишних символов через DOM события
	useEffect(() => {
		if (!phoneInputRef.current || !defaultCountry || !phone) return

		const input = phoneInputRef.current.querySelector('.PhoneInputInput') as HTMLInputElement
		if (!input) return

		const handleBeforeInput = (e: any) => {
			const currentValue = input.value || phone
			
			// Проверяем, может ли новый номер быть возможным
			if (defaultCountry) {
				// Создаем временное значение с новым символом
				const testValue = currentValue.slice(0, input.selectionStart || 0) + 
					(e.data || '') + 
					currentValue.slice(input.selectionEnd || 0)
				
				// Используем утилиту для проверки
				if (!canAddMoreDigits(testValue, defaultCountry as CountryCode) || 
					exceedsMaxLength(testValue, defaultCountry as CountryCode)) {
					// Номер превысит максимум - блокируем ввод
					e.preventDefault()
					return false
				}
			}
		}

		const handleInput = () => {
			const currentValue = input.value
			
			if (defaultCountry && currentValue) {
				// Используем утилиту для проверки
				if (!canAddMoreDigits(currentValue, defaultCountry as CountryCode) || 
					exceedsMaxLength(currentValue, defaultCountry as CountryCode)) {
					// Восстанавливаем предыдущее значение
					setTimeout(() => {
						if (input && phone) {
							input.value = phone
							setPhone(phone)
						}
					}, 0)
				}
			}
		}

		input.addEventListener('beforeinput', handleBeforeInput, true)
		input.addEventListener('input', handleInput, true)

		return () => {
			input.removeEventListener('beforeinput', handleBeforeInput, true)
			input.removeEventListener('input', handleInput, true)
		}
	}, [phone, defaultCountry])

	// Валидация номера телефона с проверкой длины для выбранной страны
	useEffect(() => {
		if (phone && defaultCountry) {
			let finalIsValid = false
			
			try {
				// Сначала проверяем длину через parsePhoneNumber
				const phoneNumber = parsePhoneNumber(phone, defaultCountry as CountryCode)
				if (phoneNumber) {
					const rules = getPhoneValidationRules(defaultCountry as CountryCode)
					if (rules) {
						const nationalNumberLength = phoneNumber.nationalNumber.length
						
						// Номер должен иметь правильную длину (минимум для страны)
						if (nationalNumberLength < rules.minLength) {
							// Номер слишком короткий - невалиден
							finalIsValid = false
						} else if (nationalNumberLength > rules.maxLength) {
							// Номер слишком длинный - невалиден
							finalIsValid = false
						} else {
							// Длина правильная, проверяем валидность через isValidPhoneNumber
							finalIsValid = isValidPhoneNumber(phone, defaultCountry as CountryCode)
						}
					} else {
						// Если нет правил, используем стандартную проверку
						finalIsValid = isValidPhoneNumber(phone, defaultCountry as CountryCode)
					}
				} else {
					// Если не удалось распарсить, номер невалиден
					finalIsValid = false
				}
			} catch {
				// Если произошла ошибка при парсинге, номер невалиден
				finalIsValid = false
			}
			
			setIsPhoneValid(finalIsValid)
		} else if (phone) {
			// Если страна не определена, проверяем общую валидность
			const isValid = isValidPhoneNumber(phone)
			setIsPhoneValid(isValid)
		} else {
			setIsPhoneValid(false)
		}
	}, [phone, defaultCountry])

	const [submittedOrderNumber, setSubmittedOrderNumber] = useState<string | null>(null)

	// Отслеживаем открытие overlay
	useEffect(() => {
		if (successOverlayOpen && currentOrderNumber) {
			setSubmittedOrderNumber(currentOrderNumber)
		}
	}, [successOverlayOpen, currentOrderNumber])

	// Очистка формы после закрытия SuccessOverlay
	useEffect(() => {
		if (submittedOrderNumber && !successOverlayOpen) {
			// Overlay был открыт и теперь закрылся, очищаем форму
			setPhone('')
			setSubmittedOrderNumber(null)
		}
	}, [submittedOrderNumber, successOverlayOpen])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!phone) {
			toast.error('Пожалуйста, введите номер телефона')
			return
		}

		// Проверка валидности номера телефона
		if (!isPhoneValid) {
			toast.error('Пожалуйста, введите полный номер телефона')
			return
		}

		setLoading(true)

		// Генерируем номер заказа перед отправкой формы
		const orderNumber = showSuccessOverlay()

		try {
			await sendFormData({
				phone: phone as string,
				orderNumber: orderNumber,
			})

			// Поля очистятся после закрытия SuccessOverlay
		} catch (err: any) {
			toast.error(err.message || 'Произошла ошибка при отправке формы')
		} finally {
			setLoading(false)
		}
	}
	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: '1040px',
				py: '40px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				'@media (max-width: 1072px)': { maxWidth: '100%', px: '16px' },
			}}
		>
			<Typography
				sx={{
					width: 'fit-content',
					fontFamily: 'Dela Gothic One',
					fontSize: '38px',
					fontWeight: 400,
					lineHeight: 1,
					textAlign: 'center',
				}}
			>
				Остались вопросы?
			</Typography>
			<Typography
				sx={{
					mt: '15px',
					fontFamily: 'Montserrat',
					fontSize: '18px',
					fontWeight: 300,
					lineHeight: 1,
					textAlign: 'center',
				}}
			>
				Оставьте свой контакт и наш менеджер перезвонит вам
			</Typography>
			<Box
				component='form'
				onSubmit={handleSubmit}
				noValidate
				sx={{
					height: '56px',
					mt: '50px',
					p: '3px',
					display: 'flex',
					alignItems: 'center',
					border: '1px solid #90F601',
					borderRadius: '13px',
					'& .PhoneInput': {
						flex: 1,
						display: 'flex',
						alignItems: 'center',
						height: '100%',
					},
					'& .PhoneInputInput': {
						flex: 1,
						backgroundColor: 'transparent',
						border: 'none',
						outline: 'none',
						fontFamily: 'Montserrat',
						fontSize: '14px',
						fontWeight: 400,
						color: '#FFFFFF',
						padding: '8px',
						height: '48px',
						'&::placeholder': {
							fontFamily: 'Montserrat',
							fontSize: '14px',
							fontWeight: 400,
							color: '#FFFFFF',
							opacity: 1,
						},
					},
					'& .PhoneInputCountry': {
						marginLeft: '6px',
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
					},
					'& .PhoneInputCountryIcon': {
						width: '36px',
						height: '36px',
						borderRadius: '6px',
					},
					'& .PhoneInputCountrySelect': {
						fontFamily: 'Montserrat',
						fontSize: '18px',
						fontWeight: 600,
						color: '#FFFFFF',
						backgroundColor: 'transparent',
						border: 'none',
						cursor: 'pointer',
					},
					'& .PhoneInputCountrySelectArrow': {
						color: '#FFFFFF',
						opacity: 0.7,
						marginLeft: '10px',
					},
					'& .PhoneInputCountrySelect:focus': {
						outline: 'none',
					},
					'& .PhoneInputCountrySelect option': {
						backgroundColor: '#000000',
						color: '#FFFFFF',
						fontFamily: 'Montserrat',
					},
				}}
			>
				<Box ref={phoneInputRef} sx={{ flex: 1 }}>
					<PhoneInput
						international
						defaultCountry={defaultCountry as any}
						value={phone}
						onChange={(value) => {
							if (!value) {
								setPhone(undefined)
								return
							}

							const country = defaultCountry as CountryCode | undefined
							
							// Используем утилиту для проверки
							if (country) {
								// Проверяем, можно ли добавить еще цифры
								if (!canAddMoreDigits(value, country)) {
									// Номер превысил максимум - блокируем ввод
									return
								}
								
								// Проверяем, превысил ли номер максимальную длину
								if (exceedsMaxLength(value, country)) {
									// Номер превысил максимум - блокируем ввод
									return
								}
							}

							setPhone(value)
						}}
						disabled={loading}
						limitMaxLength={true}
					/>
				</Box>
				<Button
					type='submit'
					variant='contained'
					disabled={loading || !isPhoneValid}
					sx={{
						width: '217px',
						height: '48px',
						borderRadius: '9px',
						backgroundColor: '#90F601',
						fontFamily: 'Montserrat',
						fontSize: '14px',
						fontWeight: 700,
						color: '#000000',
						textTransform: 'none',
						'@media (max-width: 620px)': { display: 'none' },
						'&:disabled': {
							backgroundColor: '#90F601',
							opacity: 0.6,
						},
					}}
				>
					{loading ? 'Отправка...' : 'Отправить'}
				</Button>
			</Box>
			<Button
				variant='contained'
				disabled={loading || !isPhoneValid}
				onClick={(e) => {
					e.preventDefault()
					handleSubmit(e as any)
				}}
				sx={{
					width: '355.64px',
					height: '48px',
					mt: '20px',
					borderRadius: '9px',
					backgroundColor: '#90F601',
					fontFamily: 'Montserrat',
					fontSize: '14px',
					fontWeight: 700,
					color: '#000000',
					textTransform: 'none',
					'@media (min-width: 621px)': { display: 'none' },
					'&:disabled': {
						backgroundColor: '#90F601',
						opacity: 0.6,
					},
				}}
			>
				{loading ? 'Отправка...' : 'Отправить'}
			</Button>
		</Box>
	)
}

export default QuestionBlock
