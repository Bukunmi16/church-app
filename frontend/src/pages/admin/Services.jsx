import React, { useEffect, useState } from 'react'
import { getServices } from '@/api/services.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'

const Services = () => {

      const [ service, setService ] = useState(null)
      const [ isLoading, setIsLoading ] = useState(true)
      const [ error, setError ] = useState("")
  
      useEffect(() => {
        const fetchServices = async () => {
          try {
            const {data} = await getServices()
            console.log(data.services);
  
            setService(data.services)
  
          } catch (error) {
            console.error(error)
  
            setError('Failed to load Services')
          } finally{
            setIsLoading(false)
          }
        }
  
        fetchServices()
      }, [])
  
      if (isLoading) {
        return <LoadingScreen/>
      }
  
      if(error){
        return <ErrorPage error={error}/>
      }  

  return (
    <div>Services</div>
  )
}

export default Services