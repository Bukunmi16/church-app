import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router";
import { getOneEvent, updateEvent } from '@/api/events.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import EventForm from './EventForm'

const EditEvent = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const {data} = await getOneEvent(eventId);
                setEvent(data.event);
            } catch (err) {
                console.error(err);
                setError("Failed to load this event");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!event) {
        return <ErrorPage error="This event could not be found." />;
    }

    const handleUpdate = async (payload) => {
        await updateEvent(eventId, payload);
        navigate(`/admin/events/${eventId}`);
    };

    return (
        <EventForm
            mode="edit"
            initialData={event}
            onSubmit={handleUpdate}
            backTo={`/admin/events/${eventId}`}
        />
    );
};

export default EditEvent;