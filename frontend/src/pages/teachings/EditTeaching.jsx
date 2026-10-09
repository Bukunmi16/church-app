import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router";
import { getOneTeaching, updateTeaching } from '@/api/teachings.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import TeachingForm from './TeachingForm'
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notifications.store';

const EditTeaching = () => {
    const { teachingId } = useParams();
    const navigate = useNavigate();

    const [teaching, setTeaching] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUnreadNotifications = useNotificationStore((state) => state.fetchUnreadCount);

    useEffect(() => {
        const fetchTeaching = async () => {
            try {
                const {data} = await getOneTeaching(teachingId);                
                setTeaching(data.teaching);
            } catch (err) {
                console.error(err);
                setError("Failed to load this teaching");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeaching();
    }, [teachingId]);

    useEffect(() => {
      fetchUnreadNotifications();
    }, [fetchUnreadNotifications]);

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

    try {
         await updateTeaching(teachingId, payload);
        navigate(`/teachings`);

        toast.success('Teaching Updated', {
          description: `${teaching.title} has been updated successfully.`,
          position: 'top-center',
          style: {
            background: "#202124",
            color: "#f5f5f5",
            border: "1px solid #008000",
            }        
        });

    } catch (error) {
        toast.error('Failed to Update Teaching', {
            description: `Failed to update teaching. Please try again.`,
            style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #FF0000",
              }        
        });
    }
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