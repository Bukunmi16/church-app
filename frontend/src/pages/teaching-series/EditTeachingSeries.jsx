import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router";
import { getOneTeachingSeries, updateTeachingSeries } from '@/api/teachingSeries.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import SeriesForm from './SeriesForm'

const EditTeachingSeries = () => {
    const { seriesId } = useParams();
    const navigate = useNavigate();

    const [series, setSeries] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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
    }, [seriesId]);

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
        await updateTeachingSeries(seriesId, payload);
        navigate(`/admin/teaching-series/${seriesId}`);
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