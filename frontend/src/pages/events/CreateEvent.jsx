import React from 'react'
import { useNavigate } from "react-router";
import { createEvent } from '@/api/events.api'
import EventForm from './EventForm'
import { useNotificationStore } from '@/stores/notifications.store';
import { toast } from 'sonner';

const CreateEvent = () => {
    const navigate = useNavigate();

    const fetchUnreadNotifications = useNotificationStore((state) => state.fetchUnreadCount);



    const handleCreate = async (payload) => {

      try {

        const {data} = await createEvent(payload);
        const created = data.event?.event ?? data.event;
        
        fetchUnreadNotifications(); // Update global unread count in the store
        toast.success('Event Created', {
          description: `${created.title} has been created successfully.`,
          style: {
            background: "#202124",
            color: "#f5f5f5",
            border: "1px solid #444",
            }        
        });
        navigate(`/admin/events/${created._id}`);
        fetchUnreadNotifications(); // Update global unread count in the store
      } catch (error) {
        console.error("Failed to create event:", error);
        toast.error('Failed to Create Event', {
          description: `Failed to create event. Please try again.`,
          position: 'top-center',
            style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #FF0000",
                }
        });
      }
    };

    return <EventForm mode="create" onSubmit={handleCreate} />;
};

export default CreateEvent;