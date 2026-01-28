import { Box, Typography } from "@mui/material"

const slides = ['/1.jpg', '/2.jpg', '/3.jpg']

const SliderBlock = () => {
	const slideWidth = 237
	const gap = 20
	const totalWidth = (slideWidth + gap) * slides.length

	return (
		<Box sx={{ width: '100%', py: '40px', overflow: 'hidden' }}>
			<Box sx={{ maxWidth: '1040px', width: '100%', mx: 'auto', pb: '40px', px: '16px' }}>
				<Typography
					sx={{
						fontFamily: 'Dela Gothic One',
						fontSize: '38px',
						fontWeight: 400,
						lineHeight: 1,
					}}
				>
					Что говорят наши участники

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
					Реальные отзывы от реальных людей
				</Typography>
			</Box>
			<Box sx={{ width: '100%', overflow: 'hidden' }}>
				<Box
					sx={{
						overflow: 'hidden',
						width: '100%',
						cursor: 'default',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							gap: `${gap}px`,
							width: 'max-content',
							animation: 'scroll 30s linear infinite',
							'@keyframes scroll': {
								'0%': {
									transform: 'translateX(0)',
								},
								'100%': {
									transform: `translateX(-${totalWidth}px)`,
								},
							},
						}}
					>
						{/* Дублируем слайды несколько раз для бесшовной прокрутки */}
						{[...slides, ...slides, ...slides].map((slide, index) => (
							<Box
								key={index}
								sx={{
									flex: '0 0 237px',
									width: '237px',
									height: '376px',
									pointerEvents: 'none',
								}}
							>
								<Box
									component='img'
									src={slide}
									alt={`Slide ${(index % slides.length) + 1}`}
									sx={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										borderRadius: '18px',
										display: 'block',
									}}
								/>
							</Box>
						))}
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

export default SliderBlock
