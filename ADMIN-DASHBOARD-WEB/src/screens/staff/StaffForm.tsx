import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export const StaffForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: ['staff', id],
    queryFn: async () => {
      const res = await api.get(`/staff/${id}`);
      return res.data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (staffData) {
      reset({
        ...staffData,
        joiningDate: staffData.joiningDate ? new Date(staffData.joiningDate).toISOString().split('T')[0] : ''
      });
    }
  }, [staffData, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEdit) return api.put(`/staff/${id}`, data);
      return api.post('/staff', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      navigate('/staff');
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate({
      ...data,
      baseSalary: Number(data.baseSalary)
    });
  };

  if (isEdit && isLoadingStaff) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/staff')}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEdit ? 'Edit Employee' : 'Add New Employee'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit ? 'Update staff profile and records.' : 'Register a new employee in the system.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm overflow-hidden p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code *</label>
            <input 
              {...register('employeeCode', { required: true })} 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
            {errors.employeeCode && <span className="text-xs text-danger">Employee Code is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input 
              {...register('firstName', { required: true })} 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
            {errors.firstName && <span className="text-xs text-danger">First name is required</span>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input 
              {...register('lastName', { required: true })} 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
            {errors.lastName && <span className="text-xs text-danger">Last name is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
            <input 
              {...register('designation', { required: true })} 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
            {errors.designation && <span className="text-xs text-danger">Designation is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input 
              {...register('department')} 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date *</label>
            <input 
              type="date"
              {...register('joiningDate', { required: true })} 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
            {errors.joiningDate && <span className="text-xs text-danger">Joining date is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary (₹) *</label>
            <input 
              type="number"
              {...register('baseSalary', { required: true, min: 0 })} 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
            {errors.baseSalary && <span className="text-xs text-danger">Valid salary is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              {...register('status')} 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white"
            >
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="button" 
            onClick={() => navigate('/staff')}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-70"
          >
            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? 'Update Employee' : 'Save Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};
