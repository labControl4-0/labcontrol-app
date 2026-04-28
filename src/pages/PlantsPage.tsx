import React, { useState, useEffect } from 'react';
import { getPlants } from '../services/plantService';
import { Plant } from '../interfaces/Plant';
import { useNavigate } from 'react-router-dom';

const PlantsPage: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await getPlants();
        setPlants(data);
      } catch (err) {
        setError('Failed to fetch plants');
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const handlePlantClick = (plantId: string) => {
    navigate(`/plants/${plantId}/blueprint`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Plants</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {plants.map((plant) => (
          <div
            key={plant.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              margin: '8px',
              cursor: 'pointer',
              width: '200px',
            }}
            onClick={() => handlePlantClick(plant.id)}
          >
            <h2>{plant.name}</h2>
            <p>{plant.description}</p>
            <p>
              Dimensions: {plant.widthUnits} x {plant.heightUnits}
            </p>
            <p>Scale: {plant.scale}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantsPage;
