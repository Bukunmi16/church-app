import { getTeachingSeries } from '@/api/teachingSeries.api'
import React, {useEffect} from 'react'

const TeachingSeries = () => {

    console.log('Teaching Series Page');
    

    useEffect(() => {
        const fetchTeachingSeries = async () => {
            try {
                const {data} = await getTeachingSeries()

                // const {teaching} = data
                console.log(data);
                
                // setTeaching(teachings.teachings)
                // setPagination(teachings.pagination)

            } catch (error) {
                console.error(error)

            } finally{
                // setIsInitialLoading(false)
            }
        }

        fetchTeachingSeries()
    })


  return (
    <div>TeachingSeries</div>
  )
}

export default TeachingSeries