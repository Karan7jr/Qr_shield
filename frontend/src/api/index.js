import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const scanQR      = (content) => api.post('/scan', { content }).then(r => r.data)
export const getHistory  = (params)  => api.get('/history', { params }).then(r => r.data)
export const getScan     = (id)      => api.get(`/scan/${id}`).then(r => r.data)
export const deleteScan  = (id)      => api.delete(`/history/${id}`).then(r => r.data)
export const clearHistory= ()        => api.delete('/history').then(r => r.data)
export const getStats    = ()        => api.get('/stats').then(r => r.data)