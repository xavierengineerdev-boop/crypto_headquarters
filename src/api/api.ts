const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface FormData {
	name?: string
	phone?: string
	telegram?: string
	orderNumber?: string
}

export interface ApiResponse {
	success: boolean
	message: string
	data?: any
}

export const sendFormData = async (data: FormData): Promise<ApiResponse> => {
	try {
		const response = await fetch(`${API_BASE_URL}/send`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				message: 'Ошибка отправки данных',
			}))
			throw new Error(errorData.message || 'Ошибка отправки данных')
		}

		const result: ApiResponse = await response.json()
		return result
	} catch (error) {
		console.error('Error sending form data:', error)
		throw error
	}
}
