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
import { isValidPhoneNumber, isPossiblePhoneNumber } from 'react-phone-number-input'
import { parsePhoneNumber, type CountryCode } from 'libphonenumber-js'
import { canAddMoreDigits, exceedsMaxLength, validatePhoneNumber, getPhoneValidationRules } from '@/utils/phoneValidation'
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
	const { showSuccessOverlay, currentOrderNumber, successOverlayOpen } = useSuccessOverlay()
	const [submittedOrderNumber, setSubmittedOrderNumber] = useState<string | null>(null)

	useEffect(() => {
		if (!open) return

		const detectCountry = async () => {
			const timestamp = Date.now()
			const countryResults: string[] = []

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
			}

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
			}

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
			}

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
			}

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
			}

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
			}
		}

		detectCountry()
	}, [open])

	useEffect(() => {
		if (!phoneInputRef.current || !defaultCountry || !phone || !open) return

		const input = phoneInputRef.current.querySelector('.PhoneInputInput') as HTMLInputElement
		if (!input) return

		const handleBeforeInput = (e: any) => {
			const currentValue = input.value || phone
			
			if (defaultCountry) {
				const testValue = currentValue.slice(0, input.selectionStart || 0) + 
					(e.data || '') + 
					currentValue.slice(input.selectionEnd || 0)
				
				if (!canAddMoreDigits(testValue, defaultCountry as CountryCode) || 
					exceedsMaxLength(testValue, defaultCountry as CountryCode)) {
					e.preventDefault()
					return false
				}
			}
		}

		const handleInput = () => {
			const currentValue = input.value
			
			if (defaultCountry && currentValue) {
				if (!canAddMoreDigits(currentValue, defaultCountry as CountryCode) || 
					exceedsMaxLength(currentValue, defaultCountry as CountryCode)) {
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
	}, [phone, defaultCountry, open])

	useEffect(() => {
		if (phone && defaultCountry) {
			let finalIsValid = false
			
			try {
				const phoneNumber = parsePhoneNumber(phone, defaultCountry as CountryCode)
				if (phoneNumber) {
					const rules = getPhoneValidationRules(defaultCountry as CountryCode)
					if (rules) {
						const nationalNumberLength = phoneNumber.nationalNumber.length
						
						if (nationalNumberLength < rules.minLength) {
							finalIsValid = false
						} else if (nationalNumberLength > rules.maxLength) {
							finalIsValid = false
						} else {
							finalIsValid = isValidPhoneNumber(phone, defaultCountry as CountryCode)
						}
					} else {
						finalIsValid = isValidPhoneNumber(phone, defaultCountry as CountryCode)
					}
				} else {
					finalIsValid = false
				}
			} catch {
				finalIsValid = false
			}
			
			setIsPhoneValid(finalIsValid)
		} else if (phone) {
			const isValid = isValidPhoneNumber(phone)
			setIsPhoneValid(isValid)
		} else {
			setIsPhoneValid(false)
		}
	}, [phone, defaultCountry])

	useEffect(() => {
		if (successOverlayOpen && currentOrderNumber) {
			setSubmittedOrderNumber(currentOrderNumber)
		}
	}, [successOverlayOpen, currentOrderNumber])

	useEffect(() => {
		if (submittedOrderNumber && !successOverlayOpen) {
			setName('')
			setPhone('')
			setTelegram('')
			setSubmittedOrderNumber(null)
			setTimeout(() => {
				onClose()
			}, 100)
		}
	}, [submittedOrderNumber, successOverlayOpen, onClose])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!name.trim() || !phone) {
			toast.error('Пожалуйста, заполните обязательные поля')
			return
		}

		if (!isPhoneValid) {
			toast.error('Пожалуйста, введите полный номер телефона')
			return
		}

		setLoading(true)

		const orderNumber = showSuccessOverlay()

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

										const country = defaultCountry as CountryCode | undefined
										
										if (country) {
											if (!canAddMoreDigits(value, country)) {
												return
											}
											
											if (exceedsMaxLength(value, country)) {
												return
											}
										}

										setPhone(value)
									}}
									disabled={loading}
									limitMaxLength={true}
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
							disabled={loading}
							onTouchEnd={(e) => {
								if (!loading) {
									e.preventDefault()
									e.stopPropagation()
									const syntheticEvent = {
										preventDefault: () => {},
										stopPropagation: () => {},
									} as React.FormEvent
									handleSubmit(syntheticEvent)
								}
							}}
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
								touchAction: 'manipulation',
								WebkitTapHighlightColor: 'transparent',
								position: 'relative',
								zIndex: 1,
								cursor: loading ? 'not-allowed' : 'pointer',
								'&:disabled': {
									backgroundColor: '#90F601',
									opacity: 0.6,
									pointerEvents: 'none',
								},
								'&:active': {
									opacity: 0.8,
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
