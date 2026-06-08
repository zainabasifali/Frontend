import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 90000,
})

api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.message || err.message || 'Something went wrong'
    return Promise.reject(new Error(msg))
  }
)

export const generateReport = async (files, athleteProfile) => {
  const formData = new FormData()
  files.forEach(f => formData.append('files', f))
  formData.append('profile', JSON.stringify(athleteProfile))
  return api.post('/report/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const downloadReportPDF = async reportId => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/report/${reportId}/export`,
    { responseType: 'blob' }
  )
  const url  = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href  = url
  link.setAttribute('download', `report-${reportId}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export const getExercises    = ()          => api.get('/exercises')
export const addExercise     = data        => api.post('/exercises', data)
export const updateExercise  = (id, data)  => api.put(`/exercises/${id}`, data)
export const deleteExercise  = id          => api.delete(`/exercises/${id}`)

export const getParameters   = ()     => api.get('/parameters')
export const saveParameters  = data   => api.post('/parameters', data)
