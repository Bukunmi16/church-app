import React from 'react'
import { useNavigate, useSearchParams } from "react-router";
import { createTeaching } from '@/api/teachings.api'
import TeachingForm from './TeachingForm'

const CreateTeaching = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Pre-fill the service when arriving from "Add teaching" on a service's page
    const preselectedServiceId = searchParams.get("service") || "";

    const handleCreate = async (payload) => {
        if (preselectedServiceId && !payload.get("service")) {
            payload.set("service", preselectedServiceId);
        }
        const {data} = await createTeaching(payload);

        
        navigate(`/admin/teachings/${data.teaching._id}`);
    };

    return <TeachingForm mode="create" onSubmit={handleCreate} />;
};

export default CreateTeaching;