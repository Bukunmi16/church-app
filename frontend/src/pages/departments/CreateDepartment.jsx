import React from 'react'
import { useNavigate } from "react-router";
import { createDepartment } from '@/api/departments.api'
import DepartmentForm from './DepartmentForm'
import { toast } from 'sonner';

const CreateDepartment = () => {
    const navigate = useNavigate();

    const handleCreate = async (payload) => {
        try {
            const {data} = await createDepartment(payload);
            
            const created = data.department
            // console.log(data.department.);
            toast.success('Department Created', {
                description: `${created.name} has been created successfully.`,
                position: 'top-center',
                style: {
                background: "#202124",  
                color: "#f5f5f5", 
                border: "1px solid #444",
            }})                     
            navigate(`/admin/departments/${created._id}`);
        } catch (error) {
            toast.error('Failed to Create Department', {
                description: `Failed to create department. Please try again.`,
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #FF0000",
                }
            });
        }

        }
    

    return <DepartmentForm mode="create" onSubmit={handleCreate} />;
}

export default CreateDepartment;