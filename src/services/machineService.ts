import { Machine } from '../interfaces/Machine';

const API_BASE_URL = 'http://localhost:5071';

export const getMachines = async (plantId: string): Promise<Machine[]> => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/api/machines/plant/${plantId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch machines');
  }

  return response.json();
};
