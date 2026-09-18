import api from './axios'

export const getServices = async () => {
    const services = await api.get('/services')

    return services
}