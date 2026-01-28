import {
	Dialog,
	Box,
	IconButton,
	Typography,
	TextField,
	Button,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { sendFormData } from '@/api/api'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useSuccessOverlay } from '@/App'

interface ModalBlockProps {
	open: boolean
	onClose: () => void
}

const ModalBlock = ({ open, onClose }: ModalBlockProps) => {
	const [name, setName] = useState('')
	const [phone, setPhone] = useState<string | undefined>(undefined)
	const [telegram, setTelegram] = useState('')
	const [loading, setLoading] = useState(false)
	const [defaultCountry, setDefaultCountry] = useState<string | undefined>(undefined)
	const [isPhoneValid, setIsPhoneValid] = useState(false)
	const phoneInputRef = useRef<HTMLDivElement>(null)
	const { showSuccessOverlay, currentOrderNumber } = useSuccessOverlay()

	// Определение страны по IP при открытии модального окна (чтобы учитывать VPN)
	useEffect(() => {
		if (!open) return // Определяем страну только когда модальное окно открыто

		const detectCountry = async () => {
			// Используем несколько API для определения по IP (это работает с VPN)
			// Добавляем timestamp для предотвращения кеширования
			const timestamp = Date.now()
			const countryResults: string[] = []

			// API 1: ip-api.com (надежный и бесплатный)
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

			// API 3: ipwho.is (бесплатный, без лимитов)
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

			// Выбираем наиболее частый результат или первый доступный
			if (countryResults.length > 0) {
				const countryCounts: Record<string, number> = {}
				countryResults.forEach(country => {
					countryCounts[country] = (countryCounts[country] || 0) + 1
				})

				// Находим страну с максимальным количеством совпадений
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

				// Если все API вернули разные результаты, используем первый
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
	}, [open])

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

		if (!name.trim() || !phone) {
			toast.error('Пожалуйста, заполните обязательные поля')
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

		// Нормализация Telegram-ника: добавляем @ если его нет
		let normalizedTelegram: string | undefined = undefined
		if (telegram.trim()) {
			const trimmedTelegram = telegram.trim()
			normalizedTelegram = trimmedTelegram.startsWith('@')
				? trimmedTelegram
				: `@${trimmedTelegram}`
		}

		try {
			await sendFormData({
				name: name.trim(),
				phone: phone as string,
				telegram: normalizedTelegram,
				orderNumber: orderNumber,
			})

			setName('')
			setPhone('')
			setTelegram('')

			setTimeout(() => {
				onClose()
			}, 2000)
		} catch (err: any) {
			toast.error(err.message || 'Произошла ошибка при отправке формы')
		} finally {
			setLoading(false)
		}
	}

	const handleClose = () => {
		if (!loading) {
			setName('')
			setPhone('')
			setTelegram('')
			onClose()
		}
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth={false}
			PaperProps={{
				sx: {
					position: 'relative',
					width: '100%',
					maxWidth: '1040px',
					borderRadius: '25px',
					border: '1px solid rgba(255, 255, 255, 0.3)',
					backgroundColor: 'rgba(0, 0, 0, 0.85)',
					backdropFilter: 'blur(10px)',
					color: '#FFFFFF',
					display: 'flex',
					flexDirection: 'column',
					maxHeight: '90vh',
				},
			}}
		>

				<IconButton
					onClick={handleClose}
					disabled={loading}
					sx={{
						color: '#FFFFFF',
						position: 'absolute',
						top: 16,
						right: 16,
						zIndex: 10,
					}}
				>
					<CloseIcon />
				</IconButton>

			<Box
				sx={{
					overflow: 'auto',
					flex: 1,
				}}
			>
				<Box
					sx={{
						p: '24px 40px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: '20px',
						'@media(max-width: 935px)': { p: '24px 16px' },
					}}
				>
				<Box
					sx={{
						maxWidth: '480px',
						width: '100%',
						'@media(max-width: 935px)': { maxWidth: '100%' },
					}}
				>
					<Typography
						sx={{
							fontFamily: 'Dela Gothic One',
							fontSize: '38px',
							fontWeight: 400,
							lineHeight: 1,
						}}
					>
						Форма для обратной связи
					</Typography>
					<Typography
						sx={{
							mt: '15px',
							fontFamily: 'Montserrat',
							fontSize: '18px',
							fontWeight: 300,
							lineHeight: 1,
						}}
					>
						Оставьте ваши контактные данные и наш менеджер свяжется с вами и
						предоставит больше информации.
					</Typography>
					<Box
						component='form'
						onSubmit={handleSubmit}
						noValidate
						sx={{ maxWidth: '480px', mx: 'auto' }}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault()
								handleSubmit(e as any)
							}
						}}
					>
						<Box
							sx={{
								width: '100%',
								height: '56px',
								mt: '50px',
								px: '9px',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								borderRadius: '13px',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<TextField
								fullWidth
								placeholder='Ваше имя*'
								variant='standard'
								value={name}
								onChange={e => setName(e.target.value)}
								disabled={loading}
								required
								InputProps={{
									disableUnderline: true,
									sx: {
										fontFamily: 'Montserrat',
										fontSize: '14px',
										color: '#FFFFFF',

										'&::placeholder': {
											color: '#FFFFFF',
											opacity: 1,
										},
									},
								}}
								inputProps={{
									sx: {
										fontFamily: 'Montserrat',
										fontSize: '14px',
										color: '#FFFFFF',

										'&::placeholder': {
											color: '#FFFFFF',
											opacity: 1,
										},
									},
								}}
							/>
						</Box>
						<Box
							sx={{
								width: '100%',
								height: '56px',
								mt: '15px',
								px: '9px',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								borderRadius: '13px',
								display: 'flex',
								alignItems: 'center',
								'& .PhoneInput': {
									width: '100%',
									display: 'flex',
									alignItems: 'center',
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
									'&::placeholder': {
										fontFamily: 'Montserrat',
										fontSize: '14px',
										fontWeight: 400,
										color: '#FFFFFF',
										opacity: 1,
									},
								},
								'& .PhoneInputCountry': {
									marginRight: '10px',
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
									// marginRight: '5px',
								},
								'& .PhoneInputCountrySelectArrow': {
									color: '#FFFFFF',
									marginLeft: '10px',
									opacity: 0.7,
								},
								'& .PhoneInputCountrySelect:focus': {
									outline: 'none',
								},
							}}
						>
							<Box ref={phoneInputRef}>
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
									placeholder='Номер телефона*'
								/>
							</Box>
						</Box>
						<Box
							sx={{
								width: '100%',
								height: '56px',
								mt: '15px',
								px: '9px',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								borderRadius: '13px',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<TextField
								fullWidth
								placeholder='Никнейм в Telegram'
								variant='standard'
								value={telegram}
								onChange={e => setTelegram(e.target.value)}
								disabled={loading}
								InputProps={{
									disableUnderline: true,
									sx: {
										fontFamily: 'Montserrat',
										fontSize: '14px',
										color: '#FFFFFF',

										'&::placeholder': {
											color: '#FFFFFF',
											opacity: 1,
										},
									},
								}}
								inputProps={{
									sx: {
										fontFamily: 'Montserrat',
										fontSize: '14px',
										color: '#FFFFFF',

										'&::placeholder': {
											color: '#FFFFFF',
											opacity: 1,
										},
									},
								}}
							/>
						</Box>
						<Typography
							sx={{
								mt: '60px',
								fontFamily: 'Montserrat',
								fontSize: '14px',
								fontWeight: 300,
								lineHeight: 1,
								opacity: 0.5,
								textAlign: 'center',
							}}
						>
							Поля, отмеченные символом *, обязательны <br /> для заполнения
						</Typography>
						<Button
							type='submit'
							variant='contained'
							disabled={loading || !isPhoneValid}
							sx={{
								width: '100%',
								height: '61px',
								mt: '15px',
								borderRadius: '11px',
								backgroundColor: '#90F601',
								fontFamily: 'Montserrat',
								fontSize: '14px',
								fontWeight: 700,
								color: '#000000',
								textTransform: 'none',
								'&:disabled': {
									backgroundColor: '#90F601',
									opacity: 0.6,
								},
							}}
						>
							{loading ? 'Отправка...' : 'Отправить'}
						</Button>
					</Box>
				</Box>
				<Box
					component='img'
					src='/cube.png'
					sx={{
						width: '350px',
						height: 'auto',
						'@media(max-width: 935px)': { display: 'none' },
					}}
				/>
				</Box>
			</Box>
		</Dialog>
	)
}

export default ModalBlock
