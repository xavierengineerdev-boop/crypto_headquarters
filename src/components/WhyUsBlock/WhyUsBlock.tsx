import { Box, Typography } from '@mui/material'

const WhyUsBlock = () => {
	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: '1040px',
				py: '40px',
				'@media (max-width: 1072px)': { maxWidth: '100%', px: '16px' },
			}}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					'@media (max-width: 900px)': {
						flexDirection: 'column-reverse',
						gap: '40px',
					},
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '40px',
						'@media (max-width: 900px)': { gap: '20px' },
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Typography
							sx={{
								fontFamily: 'Dela Gothic One',
								fontSize: '70px',
								fontWeight: 400,
								lineHeight: 1,
								color: '#90F601',
							}}
						>
							🎯
						</Typography>
						<Box>
							<Typography
								sx={{
									maxWidth: '350px',
									fontFamily: 'Dela Gothic One',
									fontSize: '22px',
									fontWeight: 400,
									lineHeight: 1.2,
									color: '#90F601',
								}}
							>
								Персональный подбор стратегии
							</Typography>
							<Typography
								sx={{
									maxWidth: '370px',
									mt: '10px',
									fontFamily: 'Montserrat',
									fontSize: '18px',
									fontWeight: 300,
									lineHeight: 1.2,
									letterSpacing: '-0.2px',
									'@media (max-width: 900px)': { maxWidth: '100%' },
								}}
							>
								Не “одна схема для всех”, а формат под ваш бюджет, риск и
								свободное время.
							</Typography>
						</Box>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Typography
							sx={{
								fontFamily: 'Dela Gothic One',
								fontSize: '70px',
								fontWeight: 400,
								lineHeight: 1,
								color: '#90F601',
							}}
						>
							🔒
						</Typography>
						<Box>
							<Typography
								sx={{
									maxWidth: '350px',
									fontFamily: 'Dela Gothic One',
									fontSize: '22px',
									fontWeight: 400,
									lineHeight: 1.2,
									color: '#90F601',
								}}
							>
								Никакой передачи средств
							</Typography>
							<Typography
								sx={{
									maxWidth: '370px',
									mt: '10px',
									fontFamily: 'Montserrat',
									fontSize: '18px',
									fontWeight: 300,
									lineHeight: 1.2,
									letterSpacing: '-0.2px',
									'@media (max-width: 900px)': { maxWidth: '100%' },
								}}
							>
								Вы работаете со своего аккаунта на официальной бирже
							</Typography>
						</Box>
					</Box>
				</Box>
				<Box>
					<Typography
						sx={{
							maxWidth: '380px',
							fontFamily: 'Dela Gothic One',
							fontSize: '32px',
							fontWeight: 400,
							lineHeight: 1.2,
							'@media (max-width: 900px)': { maxWidth: '100%' },
						}}
					>
						Почему выбирают нас?
					</Typography>
					<Typography
						sx={{
							maxWidth: '380px',
							mt: '10px',
							fontFamily: 'Montserrat',
							fontSize: '18px',
							fontWeight: 300,
							lineHeight: 1.2,
							letterSpacing: '-0.2px',
							'@media (max-width: 900px)': { maxWidth: '100%' },
						}}
					>
						Наше ключевое отличие — личное сопровождение на всех этапах каждого
						партнера, мы работаем на результат. Зарабатываете вы — зарабатываем
						мы.
					</Typography>
				</Box>
			</Box>
			<Box
				sx={{
					mt: '40px',
					display: 'flex',
					alignItems: 'center',
					'@media (max-width: 900px)': { mt: '20px' },
				}}
			>
				<Typography
					sx={{
						fontFamily: 'Dela Gothic One',
						fontSize: '70px',
						fontWeight: 400,
						lineHeight: 1,
						color: '#90F601',
					}}
				>
					🤝
				</Typography>
				<Box>
					<Typography
						sx={{
							maxWidth: '350px',
							fontFamily: 'Dela Gothic One',
							fontSize: '22px',
							fontWeight: 400,
							lineHeight: 1.2,
							color: '#90F601',
						}}
					>
						Оплата только за результат
					</Typography>
					<Typography
						sx={{
							mt: '10px',
							fontFamily: 'Montserrat',
							fontSize: '18px',
							fontWeight: 300,
							lineHeight: 1.2,
							letterSpacing: '-0.2px',
							'@media (max-width: 900px)': { maxWidth: '100%' },
						}}
					>
						Мы заинтересованы в вашем росте: наша комиссия — 15% от чистой
						прибыли, а не фикс “за обучение”.
					</Typography>
				</Box>
			</Box>
		</Box>
	)
}

export default WhyUsBlock
