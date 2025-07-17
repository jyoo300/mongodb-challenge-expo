import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getAllProfiles = async () => {
  try {
    const res = await api.get('/profiles');
    return res.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to fetch profiles';
  }
};

export const createProfile = async (profileData) => {
  try {
    const res = await api.post('/profiles', profileData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to create profile';
  }
};

export const updateProfile = async (id, profileData) => {
  try {
    const res = await api.put(`/profiles/${id}`, profileData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to update profile';
  }
};

export const deleteProfile = async (id) => {
  try {
    const res = await api.delete(`/profiles/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to delete profile';
  }
}; 