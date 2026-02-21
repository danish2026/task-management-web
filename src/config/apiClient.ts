import axios, { AxiosRequestConfig } from 'axios'

const ApiBaseUrl = process.env.REACT_APP_API_BASE_URL ?? 'https://api.example.com'

const ApiClient = axios.create({
	baseURL: ApiBaseUrl,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Read token from localStorage by default; you can call SetAuthToken to write it.
ApiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`
	return config
})

// Global response interceptor for auth handling
ApiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token')
			// Optional: navigate to login page
			try {
				window.location.href = '/login'
			} catch (e) {
				// ignore in non-browser environments
			}
		}
		return Promise.reject(error)
	},
)

export const SetAuthToken = (token: string | null) => {
	if (token) localStorage.setItem('token', token)
	else localStorage.removeItem('token')
}

export const GET = async <T = any>(url: string, params?: any, config?: AxiosRequestConfig) => {
	const res = await ApiClient.get<T>(url, { params, ...(config ?? {}) })
	return res.data
}

export const POST = async <T = any, B = any>(url: string, data?: B, config?: AxiosRequestConfig) => {
	const res = await ApiClient.post<T>(url, data, config)
	return res.data
}

export const PUT = async <T = any, B = any>(url: string, data?: B, config?: AxiosRequestConfig) => {
	const res = await ApiClient.put<T>(url, data, config)
	return res.data
}

export const PATCH = async <T = any, B = any>(url: string, data?: B, config?: AxiosRequestConfig) => {
	const res = await ApiClient.patch<T>(url, data, config)
	return res.data
}

export const DELETE = async <T = any>(url: string, config?: AxiosRequestConfig) => {
	const res = await ApiClient.delete<T>(url, config)
	return res.data
}
    
export const UPLOAD = async <T = any>(url: string, file: File, extraData?: Record<string, any>) => {
	const formData = new FormData()
	formData.append('file', file)
	if (extraData) {
		Object.keys(extraData).forEach((k) => formData.append(k, extraData[k]))
	}
	const res = await ApiClient.post<T>(url, formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})
	return res.data
}

export default ApiClient
