'use client';

import StudentBuilder from '@/modules/student/components/student-builder';
import { useRouter, useSearchParams } from 'next/navigation';

const StudentCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');

  const handleSubmit = () => {
      router.push('/profile'); // o cambia esta ruta según la navegación deseada
  };

  return (
    <div>
      <StudentBuilder studentId={studentId ?? undefined} afterSubmit={handleSubmit} />
    </div>
  );
};

export default StudentCreate;
