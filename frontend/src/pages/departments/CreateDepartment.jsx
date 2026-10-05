import React from 'react'
import { useNavigate } from "react-router";
import { createDepartment } from '@/api/departments.api'
import DepartmentForm from './DepartmentForm'

const CreateDepartment = () => {
    const navigate = useNavigate();

    const handleCreate = async (payload) => {
        const {data} = await createDepartment(payload);
        
        const created = data.department
        // console.log(data.department.);
        
        navigate(`/admin/departments/${created._id}`);
    };

    return <DepartmentForm mode="create" onSubmit={handleCreate} />;
};

export default CreateDepartment;