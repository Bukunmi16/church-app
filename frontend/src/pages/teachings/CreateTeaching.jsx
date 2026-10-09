import React from 'react'
import { useNavigate, useSearchParams } from "react-router";
import { createTeaching } from '@/api/teachings.api'
import TeachingForm from './TeachingForm'
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notifications.store';


const CreateTeaching = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Pre-fill the service when arriving from "Add teaching" on a service's page
    const preselectedServiceId = searchParams.get("service") || "";

    const fetchUnreadNotifications = useNotificationStore((state) => state.fetchUnreadCount);

    const handleCreate = async (payload) => {
    try {
        if (preselectedServiceId && !payload.get("service")) {
            payload.set("service", preselectedServiceId);
        }

        const {data} = await createTeaching(payload);
        fetchUnreadNotifications(); // Update global unread count in the store
        
        navigate(`/teachings`);        
        
        toast.success('Teaching Created', {
          description: `${data.teaching.title} has been created successfully.`,
          position: 'top-center',
          style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #008000",
            }        
        });
        
    } catch (error) {
        toast.error('Failed to Create Teaching', {
            description: `Failed to create teaching. Please try again.`,
            position: 'top-center',
            style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #FF0000",
              }        
        });
    }

        
    };

    return <TeachingForm mode="create" onSubmit={handleCreate} />;
};

export default CreateTeaching;