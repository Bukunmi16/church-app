import React from 'react'
import { useNavigate } from "react-router";
import { createTeachingSeries } from '@/api/teachingSeries.api'
import SeriesForm from './SeriesForm'

const CreateTeachingSeries = () => {
    const navigate = useNavigate();

    const handleCreate = async (payload) => {
        const {data} = await createTeachingSeries(payload);
        
        navigate(`/admin/teaching-series/${data.teachingSeries._id}`);
    };

    return <SeriesForm mode="create" onSubmit={handleCreate} />;
};

export default CreateTeachingSeries;