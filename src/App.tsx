import {
	FAQBlock,
	Footer,
	QuestionBlock,
	ResultsBlock,
	SliderBlock,
	SpecialBlock,
	SuccessOverlay,
	WeBlock,
	WhyUsBlock,
} from '@/components'
import { Box } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { createContext, useContext, useState } from 'react'

// Создаем контекст для управления SuccessOverlay
interface SuccessOverlayContextType {
	showSuccessOverlay: () => string
	currentOrderNumber: string
}

const SuccessOverlayContext = createContext<SuccessOverlayContextType | null>(null)

export const useSuccessOverlay = () => {
	const context = useContext(SuccessOverlayContext)
	if (!context) {
		throw new Error('useSuccessOverlay must be used within SuccessOverlayProvider')
	}
	return context
}

export type { SuccessOverlayContextType }

const App = () => {
	const [successOverlayOpen, setSuccessOverlayOpen] = useState(false)
	const [currentOrderNumber, setCurrentOrderNumber] = useState<string>('')

	// Функция генерации 6-значного номера заявки
	const generateOrderNumber = () => {
		return Math.floor(100000 + Math.random() * 900000).toString()
	}

	const showSuccessOverlay = () => {
		const orderNumber = generateOrderNumber()
		setCurrentOrderNumber(orderNumber)
		setSuccessOverlayOpen(true)
		return orderNumber
	}

	const hideSuccessOverlay = () => {
		setSuccessOverlayOpen(false)
		setCurrentOrderNumber('')
	}

	return (
		<SuccessOverlayContext.Provider value={{ showSuccessOverlay, currentOrderNumber }}>
			<>
				<Box
					sx={{
						minHeight: '100vh',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<WeBlock />
					<ResultsBlock />
					<WhyUsBlock />
					<SpecialBlock />
					<SliderBlock />
					<FAQBlock />
					<QuestionBlock />
					<Footer />
				</Box>

				{/* Полноэкранное уведомление об успехе */}
				<SuccessOverlay
					open={successOverlayOpen}
					onClose={hideSuccessOverlay}
					backgroundImage="/overlay-bg.png"
					title="Спасибо за заявку!"
					subtitle="Мы свяжемся с вами в ближайшее время"
					duration={5000}
					orderNumber={currentOrderNumber}
				/>

				<ToastContainer
					position='top-right'
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme='dark'
					toastStyle={{
						backgroundColor: 'rgba(0, 0, 0, 0.9)',
						color: '#FFFFFF',
						fontFamily: 'Montserrat, sans-serif',
					}}
				/>
			</>
		</SuccessOverlayContext.Provider>
	)
}

export default App
