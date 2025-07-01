'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

interface ClassSession {
  id: number;
  period_section_id: number;
  teacher_user_id: number;
  topic: string | null;
  date: string;
  start_time: string;
  end_time: string;
}

const ClassSessions = () => {
  const [classSessions, setClassSessions] = useState<ClassSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClassSessions = async () => {
      try {
        const response = await api.get('/class-sessions');

        if (response.data.success) {
          setClassSessions(response.data.data);
        } else {
          setError('No se pudo obtener la lista de sesiones de clase.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar sesiones de clase.');
      }
    };
    fetchClassSessions();
  }, []);

  const handleShow = (id: number) => router.push(`/classSessions/${id}`);
  const handleUpdate = (id: number) => router.push(`/classSessions/${id}/update`);
  const handleCreate = () => router.push('/classSessions/create');

  return (
    <div
      style={{
        padding: '24px',
        maxWidth: 720,
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>Sesiones de Clase</h1>

      {error ? (
        <p style={{ color: 'red' }}>Error al cargar sesiones de clase: {error}</p>
      ) : classSessions.length === 0 ? (
        <p>Cargando sesiones de clase...</p>
      ) : (
        classSessions.map((classSession) => (
          <div
            key={classSession.id}
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
              ID: {classSession.id} | Sección Periodo ID: {classSession.period_section_id} | Tema: {classSession.topic || 'Sin tema'}
            </strong>
            <p style={{ margin: '4px 0' }}>
              Fecha: {classSession.date} | Hora: {classSession.start_time} - {classSession.end_time}
            </p>
            <p style={{ margin: '4px 0' }}>Profesor ID: {classSession.teacher_user_id}</p>
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
                onClick={() => handleShow(classSession.id)}
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
                onClick={() => handleUpdate(classSession.id)}
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
        Crear Nueva Sesión de Clase
      </button>
    </div>
  );
};

export default ClassSessions;
