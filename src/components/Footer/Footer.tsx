import { Box, List, Typography } from '@mui/material'

const MENU = [
	{ label: 'Кто мы?', anchor: 'who-we-are' },
	{ label: 'Партнеры', anchor: 'partners' },
	{ label: 'Результаты', anchor: 'results' },
	{ label: 'Оффер', anchor: 'offer' },
	{ label: 'Отзывы', anchor: 'reviews' },
	{ label: 'Контакты', highlighted: true, anchor: 'contacts' },
]

const Footer = () => {
	return (
		<Box
			component='footer'
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
					alignItems: 'center',
					'@media (max-width: 900px)': {
						justifyContent: 'center',
					},
				}}
			>
				<Box component='img' src='/logo.png' />
				<List
					sx={{
						display: 'flex',
						gap: '25px',
						p: 0,
						'@media (max-width: 900px)': { display: 'none' },
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
			</Box>
			<Box
				sx={{
					width: '100%',
					height: '1px',
					my: '20px',
					backgroundColor: '#FFFFFF',
					opacity: 0.2,
				}}
			/>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					'@media (max-width: 900px)': {
						flexDirection: 'column',
						gap: '30px',
						alignItems: 'center',
					},
				}}
			>
				<Typography
					sx={{
						fontFamily: 'Montserrat',
						fontSize: '15px',
						fontWeight: 400,
						lineHeight: 1,
						'@media (max-width: 900px)': { textAlign: 'center' },
					}}
				>
					Copyright © 2026 <b>КРИПТОШТАБ</b> все права защищены
				</Typography>
				<Typography
					sx={{
						fontFamily: 'Montserrat',
						fontSize: '15px',
						fontWeight: 400,
						lineHeight: 1,
						'@media (max-width: 900px)': { textAlign: 'center' },
					}}
				>
					График работы: Пн–Пт: 09:00–21:00, Сб: 09:00–16:00
				</Typography>
			</Box>
		</Box>
	)
}

export default Footer
