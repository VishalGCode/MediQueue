import { useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export function useToken() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const generateToken = useCallback(async (patientData, departmentId, priority = 'normal') => {
    setLoading(true);
    setError(null);
    try {
      // Create patient first
      const patientRes = await api.post('/patients', patientData);
      const patientId = patientRes.data._id;

      // Generate token
      const tokenRes = await api.post('/tokens/generate', {
        patientId,
        departmentId,
        priority,
      });

      setToken(tokenRes.data);
      toast.success('Token generated successfully!');
      return tokenRes.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to generate token';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchToken = useCallback(async (tokenNumber) => {
    setLoading(true);
    try {
      const res = await api.get(`/tokens/${tokenNumber}`);
      setToken(res.data);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Token not found';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { token, loading, error, generateToken, fetchToken, setToken };
}

export default useToken;
