import { Box, Typography, Fade } from '@mui/material'
import { useEffect } from 'react'

interface SuccessOverlayProps {
	open: boolean
	onClose: () => void
	backgroundImage?: string
	title?: string
	subtitle?: string
	duration?: number
	orderNumber?: string
}

const SuccessOverlay = ({
	open,
	onClose,
	backgroundImage,
	title = "Спасибо за заявку!",
	subtitle = "Мы свяжемся с вами в ближайшее время",
	duration = 5000,
	orderNumber = "002391"
}: SuccessOverlayProps) => {

	useEffect(() => {
		if (open) {
			const timer = setTimeout(() => {
				onClose()
			}, duration)

			return () => clearTimeout(timer)
		}
	}, [open, onClose, duration])

	if (!open) return null

	return (
		<Fade in={open} timeout={300}>
			<Box
				sx={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100vw',
					height: '100vh',
					p: '16px',
					zIndex: 9999,
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					color: '#FFFFFF',
					textAlign: 'center',
				}}
			>
				<Box
					sx={{
						maxWidth: '1075px',
						animation: 'fadeInUp 0.5s ease-out',
						'@keyframes fadeInUp': {
							from: {
								opacity: 0,
								transform: 'translateY(30px)',
							},
							to: {
								opacity: 1,
								transform: 'translateY(0)',
							},
						},
					}}
				>
					<Box sx={{width: 'fit-content', mx: 'auto', mt: '8vh', display: 'flex', alignItems: 'center', gap: '20px'}}>
						<Box
						component='img'
						src='/check.png'
						sx={{
							width: '80px',
							'@media(max-width: 450px)': {
								width: '50px'
							}
						}}
					/>
					<Typography sx={{fontFamily: 'Montserrat', fontSize: '47px', fontWeight: 800, lineHeight: 1, '@media(max-width: 450px)': {
								fontSize: '28px'
							}}}>Заявка принята</Typography>
					</Box>
					<Typography
						sx={{
							fontFamily: 'Montserrat',
							fontSize: '33px',
							fontWeight: 300,
							lineHeight: 1.02,
							opacity: 0.9,
							animation: 'slideInRight 0.5s ease-out 0.4s both',
							'@keyframes slideInRight': {
								from: {
									opacity: 0,
									transform: 'translateX(30px)',
								},
								to: {
									opacity: 1,
									transform: 'translateX(0)',
								},
							},
							'@media(max-width: 450px)': {
								fontSize: '18px'
							}
						}}
					>
						Наш менеджер уже получил вашу заявку и свяжется с вами в ближайшее время.
					</Typography>

					<Box component='img' src='/sand-time.png' sx={{maxWidth: '90vw', maxHeight: '50vh', mt: '4vh', '@media(max-width: 450px)': {
								mt: '10vh'
							}}}/>

				<Box
					sx={{
						width: 'fit-content',
						position: 'absolute',
						bottom: '40px',
						left: '50%',
						transform: 'translateX(-50%)',
						animation: 'fadeIn 1s ease-out 1s both',
						'@keyframes fadeIn': {
							from: { opacity: 0 },
							to: { opacity: 1 },
						},
					}}
				>
					<Typography sx={{width: '75vw', fontFamily: 'Montserrat', fontSize: '20px', fontWeight: 300, lineHeight: 1, '@media(max-width: 450px)': {
								fontSize: '17px'
							}}}>⏱️ Обычно связываемся в течение <span style={{fontWeight: 700}}>15–30</span> минут в рабочее время.</Typography>
					<Typography sx={{mt: '10px', fontFamily: 'Montserrat', fontSize: '20px', fontWeight: 300, lineHeight: 1, opacity: 0.5, '@media(max-width: 450px)': {
								fontSize: '17px'
							}}}>Номер заявки: № {orderNumber}</Typography>
				</Box>
			</Box>
			</Box>

		</Fade>
	)
}

export default SuccessOverlay