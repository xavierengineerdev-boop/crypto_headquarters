import { Box, Button, Typography } from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { sendFormData } from '@/api/api'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useSuccessOverlay } from '@/App'

const QuestionBlock = () => {
	const [phone, setPhone] = useState<string | undefined>(undefined)
	const [loading, setLoading] = useState(false)
	const [defaultCountry, setDefaultCountry] = useState<string | undefined>(undefined)
	const [isPhoneValid, setIsPhoneValid] = useState(false)
	const phoneInputRef = useRef<HTMLDivElement>(null)
	const { showSuccessOverlay, currentOrderNumber } = useSuccessOverlay()

	// Определение страны по IP (приоритет IP API для работы с VPN)
	useEffect(() => {
		const detectCountry = async () => {
			// Используем несколько API для определения по IP (это работает с VPN)
			const timestamp = Date.now()
			const countryResults: string[] = []

			// API 1: ip-api.com
			try {
				const response = await fetch(`https://ip-api.com/json/?fields=countryCode&_=${timestamp}`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					},
					cache: 'no-store',
				})
				
				if (response.ok) {
					const data = await response.json()
					if (data.countryCode) {
						countryResults.push(data.countryCode.toUpperCase())
					}
				}
			} catch (apiError) {
				// Игнорируем ошибку
			}

			// API 2: ipapi.co
			try {
				const response = await fetch(`https://ipapi.co/json/?_=${timestamp}`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					},
					cache: 'no-store',
				})
				if (response.ok) {
					const data = await response.json()
					if (data.country_code) {
						countryResults.push(data.country_code.toUpperCase())
					}
				}
			} catch (apiError) {
				// Игнорируем ошибку
			}

			// API 3: ipwho.is
			try {
				const response = await fetch(`https://ipwho.is/?_=${timestamp}`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
					},
					cache: 'no-store',
				})
				if (response.ok) {
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

	// Контроль максимальной длины номера телефона (13 символов включая + и код страны)
	useEffect(() => {
		if (phone) {
			const cleanValue = phone.replace(/[\s\-()]/g, '')
			if (cleanValue.length > 13) {
				// Немедленно обрезаем до 13 символов
				const trimmed = cleanValue.substring(0, 13)
				if (trimmed !== phone) {
					setPhone(trimmed)
				}
			}
		}
	}, [phone])

	// Прямой контроль через DOM для предотвращения ввода лишних символов
	useEffect(() => {
		const checkAndLimitInput = () => {
			if (phoneInputRef.current) {
				const input = phoneInputRef.current.querySelector('.PhoneInputInput') as HTMLInputElement
				if (input) {
					// Блокируем ввод клавиш, если уже достигнут лимит
					const handleKeyDown = (e: KeyboardEvent) => {
						const currentValue = input.value || ''
						const cleanValue = currentValue.replace(/[\s\-()]/g, '')
						
						// Разрешаем удаление (Backspace, Delete) и навигацию
						if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.key)) {
							return
						}
						
						// Если уже достигнут лимит, блокируем ввод
						if (cleanValue.length >= 13) {
							e.preventDefault()
							e.stopPropagation()
							return false
						}
					}

					// Блокируем ввод через beforeinput
					const handleBeforeInput = (e: any) => {
						const currentValue = input.value || ''
						const cleanValue = currentValue.replace(/[\s\-()]/g, '')
						if (cleanValue.length >= 13 && e.data) {
							e.preventDefault()
							return false
						}
					}

					// Контролируем ввод после того, как он произошел
					const handleInput = () => {
						const currentValue = input.value || ''
						const cleanValue = currentValue.replace(/[\s\-()]/g, '')
						
						if (cleanValue.length > 13) {
							// Обрезаем до 13 символов
							const trimmed = cleanValue.substring(0, 13)
							setPhone(trimmed)
						}
					}

					input.addEventListener('keydown', handleKeyDown, true)
					input.addEventListener('beforeinput', handleBeforeInput, true)
					input.addEventListener('input', handleInput, true)

					return () => {
						input.removeEventListener('keydown', handleKeyDown, true)
						input.removeEventListener('beforeinput', handleBeforeInput, true)
						input.removeEventListener('input', handleInput, true)
					}
				}
			}
		}

		const timeoutId = setTimeout(checkAndLimitInput, 100)
		return () => clearTimeout(timeoutId)
	}, [phone])

	// Валидация номера телефона
	useEffect(() => {
		if (phone) {
			const isValid = isValidPhoneNumber(phone, defaultCountry as any)
			setIsPhoneValid(isValid)
		} else {
			setIsPhoneValid(false)
		}
	}, [phone, defaultCountry])

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

			setPhone('')
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
							// Ограничение: максимум 13 символов включая + и код страны
							// Убираем все пробелы, дефисы и другие символы форматирования
							const cleanValue = value.replace(/[\s\-()]/g, '')
							
							// Всегда обрезаем до 13 символов, если превышен лимит
							if (cleanValue.length > 13) {
								const trimmed = cleanValue.substring(0, 13)
								// Используем setTimeout для немедленного обновления
								setTimeout(() => setPhone(trimmed), 0)
							} else {
								setPhone(value)
							}
						}}
						disabled={loading}
						placeholder='Номер телефона'
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
