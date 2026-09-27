import api from "./axios";

export const getDepartments = () => {
    const response = api.get('/departments')

    return response 
}