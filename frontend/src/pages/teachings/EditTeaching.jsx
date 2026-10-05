import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router";
import { getOneTeaching, updateTeaching } from '@/api/teachings.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import TeachingForm from './TeachingForm'

const EditTeaching = () => {
    const { teachingId } = useParams();
    const navigate = useNavigate();

    const [teaching, setTeaching] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTeaching = async () => {
            try {
                const data = await getOneTeaching(teachingId);                
                setTeaching(data.data.teaching);
            } catch (err) {
                console.error(err);
                setError("Failed to load this teaching");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeaching();
    }, [teachingId]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!teaching) {
        return <ErrorPage error="This teaching could not be found." />;
    }

    const handleUpdate = async (payload) => {
        await updateTeaching(teachingId, payload);
        navigate(`/admin/teachings/${teachingId}`);
    };

    return (
        <TeachingForm
            mode="edit"
            initialData={teaching}
            onSubmit={handleUpdate}
            backTo={`/admin/teachings/${teachingId}`}
        />
    );
};

export default EditTeaching;