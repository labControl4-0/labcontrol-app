import { Sector } from '../interfaces/Sector';

const API_BASE_URL = 'http://localhost:5071';

export const getSectors = async (plantVersionId: string): Promise<Sector[]> => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/api/sectors/plantVersion/${plantVersionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sectors');
  }

  return response.json();
};

export interface CreateSectorDto {
  plantVersionId: string;
  name: string;
  type: string;
  color: string;
  points: { x: number; y: number }[];
}

export const createSector = async (sectorData: CreateSectorDto): Promise<Sector> => {
  const token = localStorage.getItem('token');

  // The backend expects points with uppercase X and Y
  const payload = {
    ...sectorData,
    points: sectorData.points.map(p => ({ X: p.x, Y: p.y })),
    areaM2: 0, // Assuming default area, adjust if needed
  };

  const response = await fetch(`${API_BASE_URL}/api/sectors`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create sector');
  }

  return response.json();
};
