import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	base: '/',
	plugins: [react()],
	resolve: {
		alias: {
			'@': '/src',
			'@assets': '/src/assets',
			'@components': '/src/components',
			'@config': '/src/config',
			'@hooks': '/src/hooks',
			'@layouts': '/src/layouts',
			'@pages': '/src/pages',
			'@router': '/src/router',
			'@store': '/src/store',
			'@styles': '/src/styles',
			'@types': '/src/types',
			'@utils': '/src/utils',
			'@fonts': '/src/fonts',
			'@api': '/src/api',
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					react: ['react', 'react-dom', 'react-router-dom'],
				},
			},
		},
	},
})
