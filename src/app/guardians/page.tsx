'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

interface Guardian {
  id: number;
  user_id: number;
}

const Guardians = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGuardians = async () => {
      try {
        const response = await api.get('/guardians');

        if (response.data.success) {
          setGuardians(response.data.data);
        } else {
          setError('No se pudo obtener la lista de apoderados.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar apoderados.');
      }
    };
    fetchGuardians();
  }, []);

  const handleShow = (id: number) => router.push(`/guardians/${id}`);
  const handleUpdate = (id: number) => router.push(`/guardians/${id}/update`);
  const handleCreate = () => router.push('/guardians/create');

  return (
    <div
      style={{
        padding: '24px',
        maxWidth: 720,
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>Apoderados</h1>

      {error ? (
        <p style={{ color: 'red' }}>Error al cargar apoderados: {error}</p>
      ) : guardians.length === 0 ? (
        <p>Cargando apoderados...</p>
      ) : (
        guardians.map((guardian) => (
          <div
            key={guardian.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #ccc',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              backgroundColor: '#fafafa',
              color: '#000000',
            }}
          >
            <strong style={{ fontSize: '18px', marginBottom: '8px' }}>
              ID: {guardian.id} | Usuario ID: {guardian.user_id}
            </strong>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#4f46e5',
                  color: '#fff',
                  fontWeight: 500,
                }}
                onClick={() => handleShow(guardian.id)}
              >
                Ver
              </button>
              <button
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#f59e0b',
                  color: '#fff',
                  fontWeight: 500,
                }}
                onClick={() => handleUpdate(guardian.id)}
              >
                Actualizar
              </button>
            </div>
          </div>
        ))
      )}

      <button
        style={{
          marginTop: '32px',
          width: '100%',
          padding: '14px 0',
          backgroundColor: '#9333ea',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '18px',
          transition: 'background-color 0.3s ease',
        }}
        onClick={handleCreate}
      >
        Crear Nuevo Apoderado
      </button>
    </div>
  );
};

export default Guardians;
