import React from 'react'
import { useNavigate } from "react-router";
import { createTeachingSeries } from '@/api/teachingSeries.api'
import SeriesForm from './SeriesForm'
import { toast } from 'sonner';

const CreateTeachingSeries = () => {
    const navigate = useNavigate();

    const handleCreate = async (payload) => {
        try {
            const {data} = await createTeachingSeries(payload);
            navigate(`/admin/teaching-series/${data.teachingSeries._id}`);
            toast.success('Teaching Series Created', {
                description: `${data.teachingSeries.title} has been created successfully.`,
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #008000",
                }
            });
        } catch (error) {
            toast.error('Failed to Create Teaching Series', {
                description: `Failed to create teaching series. Please try again.`,
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #FF0000",
                }
            });
        }
    };

    return <SeriesForm mode="create" onSubmit={handleCreate} />;
};

export default CreateTeachingSeries;