'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../../lib/api';
import GuardianBuilder, { GuardianData } from '@/modules/guardian/components/guardian-builder'; // asegúrate de que esta ruta sea correcta

const GuardianCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const guardianId = searchParams.get('guardianId');

  const handleSubmit = async (guardianData: GuardianData) => {
    try {
      await api.post('/guardians', guardianData);
      alert('Apoderado creado exitosamente');
      router.push('/profile'); // ajusta según el flujo de tu app
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  return (
    <div>
      <GuardianBuilder guardianId={guardianId ?? undefined} onSubmit={handleSubmit} />
    </div>
  );
};

export default GuardianCreate;
