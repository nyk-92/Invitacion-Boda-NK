import { useEffect, useState } from 'react';
import './LightRays.css';

const LightRays = () => {
  const [rays, setRays] = useState([]);

  useEffect(() => {
    // Generar rayos aleatorios
    const generateRays = () => {
      const newRays = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.4,
      }));
      setRays(newRays);
    };

    generateRays();

    // Regenerar rayos cada 8 segundos
    const interval = setInterval(generateRays, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="light-rays-container">
      {rays.map((ray) => (
        <div
          key={ray.id}
          className="light-ray"
          style={{
            left: `${ray.left}%`,
            '--delay': `${ray.delay}s`,
            '--duration': `${ray.duration}s`,
            '--opacity': ray.opacity,
          }}
        />
      ))}
      
      {/* Destellos adicionales */}
      <div className="sparkle sparkle-1"></div>
      <div className="sparkle sparkle-2"></div>
      <div className="sparkle sparkle-3"></div>
    </div>
  );
};

export default LightRays;
