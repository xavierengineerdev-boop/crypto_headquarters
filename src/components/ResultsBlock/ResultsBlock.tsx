import { Box, Typography } from '@mui/material'

const results = [
	{
		title: '$6млн',
		desc: 'Заработано за 2025 год',
	},
	{
		title: '5+',
		desc: 'Лет опыта в сфере',
	},
	{
		title: '1390',
		desc: 'Активных участников',
	},
]

const ResultsBlock = () => {
	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: '1040px',
				py: '40px',
				'@media (max-width: 1072px)': { maxWidth: '100%', px: '16px' },
			}}
		>
			<Typography
				sx={{
					fontFamily: 'Dela Gothic One',
					fontSize: '38px',
					fontWeight: 400,
					lineHeight: 1,
					'@media (max-width: 900px)': { textAlign: 'center' },
				}}
			>
				Наши результаты
			</Typography>
			<Box
				sx={{
					mt: '40px',
					display: 'flex',
					justifyContent: 'space-between',
					'@media (max-width: 900px)': {
						flexDirection: 'column',
						gap: '40px',
						alignItems: 'center',
					},
				}}
			>
				{results.map((result, index) => (
					<Box key={index}>
						<Typography
							sx={{
								fontFamily: 'Dela Gothic One',
								fontSize: '74px',
								fontWeight: 400,
								lineHeight: 1,
								color: '#90F601',
								'@media (max-width: 900px)': { textAlign: 'center' },
							}}
						>
							{result.title}
						</Typography>
						<Typography
							sx={{
								mt: '20px',
								fontFamily: 'Montserrat',
								fontSize: '22px',
								fontWeight: 200,
								lineHeight: 1,
							}}
						>
							{result.desc}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	)
}

export default ResultsBlock
