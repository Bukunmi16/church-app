import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router";
import { getOneTeachingSeries, updateTeachingSeries } from '@/api/teachingSeries.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import SeriesForm from './SeriesForm'
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notifications.store';

const EditTeachingSeries = () => {
    const fetchUnreadNotifications = useNotificationStore((state) => state.fetchUnreadCount);
    const { seriesId } = useParams();
    const navigate = useNavigate();

    const [series, setSeries] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUnreadNotifications();
        const fetchSeries = async () => {
            try {
                const {data} = await getOneTeachingSeries(seriesId);
                setSeries(data.series.series);
            } catch (err) {
                console.error(err);
                setError("Failed to load this series");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSeries();
    }, [seriesId, fetchUnreadNotifications]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!series) {
        return <ErrorPage error="This series could not be found." />;
    }

    const handleUpdate = async (payload) => {
        try {
            await updateTeachingSeries(seriesId, payload);
            navigate(`/admin/teaching-series/${seriesId}`);
         toast.success('Teaching Series Updated', {
                description: `${series.title} has been updated successfully.`,
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #008000",
                }
            });
        } catch (error) {
            toast.error('Failed to Update Teaching Series', {
                description: `Failed to update teaching series. Please try again.`,
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #FF0000",
                }
            });
        }
    };

    return (
        <SeriesForm
            mode="edit"
            initialData={series}
            onSubmit={handleUpdate}
            backTo={`/admin/teaching-series/${seriesId}`}
        />
    );
};

export default EditTeachingSeries;