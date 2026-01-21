import axios from 'axios';
import { Issue } from './types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getIssues = async (sortBy: string = 'priority'): Promise<Issue[]> => {
    const response = await api.get(`/issues?sort_by=${sortBy}`);
    // Transform backend fields to frontend types if necessary
    return response.data.map((item: any) => ({
        ...item,
        text: item.description, // Map description to text
        image: item.image_url ? `${API_BASE_URL}${item.image_url}` : null,
        priority: item.priority_score
    }));
};

export const submitIssue = async (formData: FormData) => {
    // Note: Content-Type header is set automatically by browser for FormData
    const response = await axios.post(`${API_BASE_URL}/issues`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data;
};

export const upvoteIssue = async (id: number) => {
    const response = await api.post(`/issues/${id}/upvote`);
    return response.data;
};

export const getAnalytics = async () => {
    const response = await api.get('/analytics');
    return response.data;
};

export const getHeatmap = async () => {
    const response = await api.get('/heatmap');
    return response.data;
};

export const loginAnonymous = async () => {
    const response = await api.post('/auth/anonymous');
    return response.data;
};
