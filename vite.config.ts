import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	base: '/',
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@components': path.resolve(__dirname, './src/components'),
			'@config': path.resolve(__dirname, './src/config'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@layouts': path.resolve(__dirname, './src/layouts'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@router': path.resolve(__dirname, './src/router'),
			'@store': path.resolve(__dirname, './src/store'),
			'@styles': path.resolve(__dirname, './src/styles'),
			'@types': path.resolve(__dirname, './src/types'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@fonts': path.resolve(__dirname, './src/fonts'),
			'@api': path.resolve(__dirname, './src/api'),
		},
	},
	server: {
		fs: {
			strict: false,
		},
		hmr: {
			overlay: true,
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
	optimizeDeps: {
		include: ['react', 'react-dom', 'react-router-dom'],
	},
})
