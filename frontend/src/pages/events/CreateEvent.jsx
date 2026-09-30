import React from 'react'
import { useNavigate } from "react-router";
import { createEvent } from '@/api/events.api'
import EventForm from './EventForm'

const CreateEvent = () => {
    const navigate = useNavigate();

    const handleCreate = async (payload) => {
        const data = await createEvent(payload);
        const created = data.event?.event ?? data.event;
        navigate(`/admin/events/${created._id}`);
    };

    return <EventForm mode="create" onSubmit={handleCreate} />;
};

export default CreateEvent;