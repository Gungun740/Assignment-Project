import { useState, useCallback } from 'react';
import { tasksApi } from '../api/tasks';
import toast from 'react-hot-toast';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await tasksApi.getAll({ page: 0, size: 10, sortBy: 'createdAt', direction: 'DESC', ...params });
      const { content, page, totalPages, totalElements } = data.data;
      setTasks(content);
      setPagination({ page, totalPages, totalElements });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (payload) => {
    const { data } = await tasksApi.create(payload);
    return data.data;
  };

  const updateTask = async (id, payload) => {
    const { data } = await tasksApi.update(id, payload);
    return data.data;
  };

  const deleteTask = async (id) => {
    await tasksApi.delete(id);
  };

  return { tasks, pagination, loading, fetchTasks, createTask, updateTask, deleteTask };
}