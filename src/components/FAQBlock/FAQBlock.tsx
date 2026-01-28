import { useState } from 'react'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { Box, Typography, Collapse } from '@mui/material'

const FAQ_ITEMS = [
	{
		question: 'Нужен ли опыт в крипте, чтобы начать?',
		answer:
			'Нет. Мы даём пошаговую инструкцию и сопровождаем лично — разберётесь в процессе, даже если вы новичок',
	},
	{
		question: 'Это безопасно? Вы получаете доступ к моим деньгам?',
		answer:
			'Да, это безопасно. Доступа к вашим деньгам мы не получаем: средства всегда остаются на вашем личном аккаунте на официальной бирже.',
	},
	{
		question: 'Сколько можно заработать?',
		answer:
			'Это зависит от вашего бюджета, выбранной стратегии и того, сколько времени вы готовы уделять. Мы не обещаем фиксированные цифры, потому что рынок меняется, и доходность не гарантируется. На консультации мы оценим ваши ресурсы и подберём модель, чтобы вы понимали реалистичный диапазон именно для вашей ситуации.',
	},
]

const FAQBlock = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(0)

	const handleToggle = (index: number) => {
		setOpenIndex(prev => (prev === index ? null : index))
	}

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
					textAlign: 'center',
				}}
			>
				Частые вопросы
			</Typography>

			<Box sx={{ mt: '70px' }}>
				{FAQ_ITEMS.map((item, index) => {
					const isOpen = openIndex === index

					return (
						<Box key={index}>
							<Box
								onClick={() => handleToggle(index)}
								sx={{
									mt: '30px',
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									gap: '20px',
									cursor: 'pointer',
								}}
							>
								<Typography
									sx={{
										fontFamily: 'Montserrat',
										fontSize: '24px',
										fontWeight: 600,
										lineHeight: 1,
									}}
								>
									{item.question}
								</Typography>

								{isOpen ? (
									<RemoveIcon sx={{ width: '32px', height: '32px' }} />
								) : (
									<AddIcon sx={{ width: '32px', height: '32px' }} />
								)}
							</Box>

							<Collapse in={isOpen} timeout={300}>
								<Typography
									sx={{
										maxWidth: '900px',
										mt: '10px',
										fontFamily: 'Montserrat',
										fontSize: '18px',
										fontWeight: 300,
										lineHeight: 1.4,
									}}
								>
									{item.answer}
								</Typography>
							</Collapse>

							{index < FAQ_ITEMS.length - 1 && (
								<Box
									sx={{
										width: '100%',
										height: '1px',
										my: '30px',
										backgroundColor: '#FFFFFF',
										opacity: 0.2,
									}}
								/>
							)}
						</Box>
					)
				})}
			</Box>
		</Box>
	)
}

export default FAQBlock
