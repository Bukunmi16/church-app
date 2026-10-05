import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router";
import { getOneDepartment, updateDepartment } from '@/api/departments.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import DepartmentForm from './DepartmentForm'

const EditDepartment = () => {
    const { departmentId } = useParams();
    const navigate = useNavigate();

    const [department, setDepartment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const {data} = await getOneDepartment(departmentId);
                setDepartment(data.department?.department ?? data.department);
            } catch (err) {
                console.error(err);
                setError("Failed to load this department");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDepartment();
    }, [departmentId]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!department) {
        return <ErrorPage error="This department could not be found." />;
    }

    const handleUpdate = async (payload) => {
        await updateDepartment(departmentId, payload);
        // console.log(payload);
        
        navigate(`/admin/departments/${departmentId}`);
    };

    return (
        <DepartmentForm
            mode="edit"
            initialData={department}
            onSubmit={handleUpdate}
            backTo={`/admin/departments/${departmentId}`}
        />
    );
};

export default EditDepartment;