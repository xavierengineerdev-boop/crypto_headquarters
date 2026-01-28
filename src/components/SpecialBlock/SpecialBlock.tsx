import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react'
import ModalBlock from '../ModalBlock'

const SpecialBlock = () => {
	const [open, setOpen] = useState(false)
	
	return (
		<Box
			sx={{
				width: '100%',
				my: '40px',
				mt: '100px',
				background:
					'linear-gradient(90deg, #0084FF00 0%, #0084FF00 10%, #030172FF 100%)',
				'@media (max-width: 1072px)': {
					maxWidth: '100%',
					px: '16px',
				},
				'@media (max-width: 1020px)': {
					background:
						'linear-gradient(0deg, #0084FF00 0%, #0084FF00 10%, #030172FF 100%)',
				},
			}}
		>
			<Box sx={{ maxWidth: '1040px', mx: 'auto', py: '20px' }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Box>
						<Typography
							sx={{
								fontFamily: 'Dela Gothic One',
								fontSize: '51px',
								fontWeight: 400,
								lineHeight: 1,
								'@media (max-width: 1020px)': { fontSize: '34px' },
							}}
						>
							СПЕЦИАЛЬНОЕ <br /> ПРЕДЛОЖЕНИЕ
						</Typography>
						<Typography
							sx={{
								mt: '15px',
								fontFamily: 'Montserrat',
								fontSize: '22px',
								fontWeight: 200,
								lineHeight: 1,
							}}
						>
							От наших партнеров — Bybit, Binance, BinaryX, OKX
						</Typography>

						<Typography
							sx={{
								maxWidth: '620px',
								mt: '30px',
								fontFamily: 'Montserrat',
								fontSize: '22px',
								fontWeight: 400,
								lineHeight: 1.1,
								'@media (max-width: 1020px)': { maxWidth: '100%' },
							}}
						>
							Пройди регистрацию до <b>31.01.2026</b> и получи реферальный бонус
							до <b>15%</b> от первоначальных инвестиций на платформах партнеров.
						</Typography>
					</Box>
					<Box
						component='img'
						src='/cube.png'
						sx={{
							width: '370px',
							mt: '-60px',
							'@media (max-width: 1020px)': { display: 'none' },
						}}
					/>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<Box
						component='img'
						src='/cube.png'
						sx={{
							width: '370px',
							mt: '60px',
							mx: 'auto',
							'@media (min-width: 1021px)': { display: 'none' },
							'@media (max-width: 620px)': { width: '330px' },
						}}
					/>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: '50px' }}>
					<Button
						onClick={() => setOpen(true)}
						variant='contained'
						sx={{
							mx: 'auto',
							width: '332px',
							height: '74px',
							borderRadius: '15px',
							backgroundColor: '#5ac8ff10',
							fontFamily: 'Montserrat',
							fontSize: '18px',
							fontWeight: 700,
							lineHeight: 1,
							textTransform: 'none',
							color: '#0084FF',
							boxShadow: 'none',
						}}
					>
						Пройди регистрацию
					</Button>
				</Box>
			</Box>
			<ModalBlock open={open} onClose={() => setOpen(false)} />
		</Box>
	)
}

export default SpecialBlock
