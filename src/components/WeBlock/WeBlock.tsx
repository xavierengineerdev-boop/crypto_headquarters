import { Box, Button, List, Typography } from '@mui/material'
import TelegramIcon from '@mui/icons-material/Telegram'
import { useState } from 'react'
import ModalBlock from '../ModalBlock'

const MENU = [
	{ label: 'Кто мы?', highlighted: true, anchor: 'who-we-are' },
	{ label: 'Партнеры', anchor: 'partners' },
	{ label: 'Результаты', anchor: 'results' },
	{ label: 'Оффер', anchor: 'offer' },
	{ label: 'Отзывы', anchor: 'reviews' },
	{ label: 'Контакты', anchor: 'contacts' },
]

const images = ['/bybit.png', '/binance.png', '/okx.png', '/binary.png']

const WeBlock = () => {
	const [open, setOpen] = useState(false)
	return (
		<Box
			sx={{
				width: '100%',
				mb: '40px	',
				backgroundImage: 'url(/bg.png)',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			<Box
				component='header'
				sx={{
					maxWidth: '1040px',
					width: '100%',
					mx: 'auto',
					py: '10px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					'@media (max-width: 1072px)': {
						maxWidth: '100%',
						px: '16px',
					},
				}}
			>
				<Box component='img' src='/logo.png' />
				<List
					sx={{
						display: 'flex',
						gap: '25px',
						p: 0,
						'@media (max-width: 1020px)': {
							display: 'none',
						},
					}}
				>
					{MENU.map((item, index) => (
						<Typography
							key={index}
							component='li'
							onClick={() => {
								const element = document.getElementById(item.anchor || '')
								if (element) {
									element.scrollIntoView({ behavior: 'smooth', block: 'start' })
								}
							}}
							sx={{
								fontFamily: 'Montserrat',
								fontSize: '15px',
								fontWeight: item.highlighted ? 800 : 400,
								lineHeight: 1,
								color: item.highlighted ? '#93FA00' : 'inherit',
								listStyle: 'none',
								cursor: 'pointer',
								'&:hover': {
									color: '#93FA00',
								},
							}}
						>
							{item.label}
						</Typography>
					))}
				</List>
				<Button
					component='a'
					href='https://t.me/Den_THE_NOX'
					target='_blank'
					rel='noopener noreferrer'
					sx={{
						width: '164px',
						height: '47px',
						borderRadius: '13px',
						minWidth: 'unset',
						textTransform: 'none',
						border: '1px solid #0084FFB2',
						color: '#FFFFFF',
						textDecoration: 'none',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: '5px',
							fontFamily: 'Montserrat',
							fontSize: '14px',
							fontWeight: 500,
						}}
					>
						<Box
							sx={{
								width: '28px',
								height: '28px',
								borderRadius: '50%',
								backgroundColor: '#00AEFF',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<TelegramIcon sx={{ fontSize: '16px', color: '#FFFFFF' }} />
						</Box>
						Задать вопрос
					</Box>
				</Button>
			</Box>
			<Box
				sx={{
					maxWidth: '1280px',
					width: '100%',
					mx: 'auto',
					mt: '70px',
					px: '16px',
					display: 'flex',
					justifyContent: 'space-between',
					gap: '20px',
					'@media (max-width: 1020px)': {
						width: '100%',
					},
				}}
			>
				<Box
					component='img'
					src='/leo.png'
					sx={{
						width: '450px',
						height: 'auto',
						'@media (max-width: 1120px)': { width: '400px' },
						'@media (max-width: 1020px)': {
							display: 'none',
						},
					}}
				/>
				<Box
					sx={{
						'@media (max-width: 1020px)': {
							width: '100%',
						},
					}}
				>
					<Typography
						sx={{
							maxWidth: '620px',
							fontFamily: 'Dela Gothic One',
							fontSize: '50px',
							fontWeight: 400,
							lineHeight: 1,
							'@media (max-width: 1120px)': { fontSize: '40px' },
							'@media (max-width: 1020px)': {
								textAlign: 'right',
								maxWidth: '100%',
							},
							'@media (max-width: 460px)': {
								fontSize: '34px',
							},
						}}
					>
						Мы — команда, которая доводит до{' '}
						<span style={{ color: '#93FA00' }}>результата</span> в крипте
					</Typography>
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<Box
							component='img'
							src='/leo.png'
							sx={{
								width: '450px',
								height: 'auto',
								mx: 'auto',
								mt: '30px',
								'@media (min-width: 1021px)': {
									display: 'none',
								},
								'@media (max-width: 700px)': {
									width: '400px',
								},
								'@media (max-width: 460px)': {
									width: '350px',
								},
							}}
						/>
					</Box>
					<Typography
						sx={{
							maxWidth: '620px',
							mt: '25px',
							fontFamily: 'Montserrat',
							fontSize: '24px',
							fontWeight: 300,
							lineHeight: 1,
							'@media (max-width: 1020px)': { maxWidth: '100%' },
						}}
					>
						Даем пошаговый план, сопровождаем лично от начала до конца. Вы
						зарабатываете на своем аккаунте. <br /> Все прозрачно и честно
					</Typography>
					<Box
						sx={{
							width: 'fit-content',
							position: 'relative',
							mt: '20px',
							'@media (max-width: 1020px)': {
								mx: 'auto',
								mt: '70px',
							},
						}}
					>
						<Button
							onClick={() => setOpen(true)}
							sx={{
								width: '353px',
								height: '56px',
								borderRadius: '13px',
								textTransform: 'none',
								border: '3px solid #90F601',
								fontFamily: 'Montserrat',
								fontSize: '18px',
								fontWeight: 800,
								lineHeight: 1,
								color: '#90F601',
							}}
						>
							Оставить заявку
						</Button>
						<Box
							component='img'
							src='/arrow 1.png'
							sx={{
								width: '170px',
								position: 'absolute',
								left: '100%',
								top: '-130%',
								'@media (max-width: 1020px)': { display: 'none' },
							}}
						/>
						<Box
							component='img'
							src='/arrow 2.png'
							sx={{
								width: '100px',
								position: 'absolute',
								left: '28%',
								top: '-130%',
								'@media (min-width: 1021px)': { display: 'none' },
							}}
						/>
					</Box>
				</Box>
			</Box>
			<Box
				id="partners"
				sx={{
					px: '16px',
					mt: '-30px',
					'@media (max-width: 1020px)': {
						mt: '50px',
					},
				}}
			>
				<Typography
					sx={{
						fontFamily: 'Dela Gothic One',
						fontSize: '39px',
						fontWeight: 400,
						lineHeight: 1,
						textAlign: 'center',
					}}
				>
					Партнеры
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
					Мы являемся официальными партнерами таких площадок
				</Typography>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						gap: '20px',
						mt: '20px',
						flexWrap: 'wrap',
					}}
				>
					{images.map((src, index) => (
						<Box
							key={index}
							sx={{
								width: '250px',
								height: '103px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								border: '1px solid #90F601',
								borderRadius: '15px',
							}}
						>
							<Box component='img' src={src} />
						</Box>
					))}
				</Box>
			</Box>
			<ModalBlock open={open} onClose={() => setOpen(false)} />
		</Box>
	)
}

export default WeBlock
