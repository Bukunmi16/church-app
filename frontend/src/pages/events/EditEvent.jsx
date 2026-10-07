import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router";
import { getOneEvent, updateEvent } from '@/api/events.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import EventForm from './EventForm'
import { useNotificationStore } from '@/stores/notifications.store';
import { toast } from 'sonner';

const EditEvent = () => {
    const fetchUnreadNotifications = useNotificationStore((state) => state.fetchUnreadCount);
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
        fetchUnreadNotifications(); // Update global unread count in the store
    }, [eventId, fetchUnreadNotifications]);

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
        try {
            await updateEvent(eventId, payload);
            navigate(`/admin/events/${eventId}`);
        toast.success('Event Updated', {
                description: `${event.title} has been updated successfully.`,
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #008000",
                }
            });
        } catch (error) {
            toast.error('Failed to Update Event', {
                description: `Failed to update event. Please try again.`,
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
        <EventForm
            mode="edit"
            initialData={event}
            onSubmit={handleUpdate}
            backTo={`/admin/events/${eventId}`}
        />
    );
};

export default EditEvent;