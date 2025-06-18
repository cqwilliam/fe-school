// "use client";

// import { useState } from "react";
// import api from "../../lib/api";

// interface TeacherData {
//   user_id: number;
//   specialty: string;
//   academic_degree: string;
// }

// interface StudentData {
//   user_id: number;
//   grade: string;
//   section: string;
// }

// const Form = <T,>({
//   title,
//   initialData,
//   onSubmit,
//   children,
// }: {
//   title: string;
//   initialData: T;
//   onSubmit: (data: T) => Promise<void>;
//   children: (
//     data: T,
//     setData: React.Dispatch<React.SetStateAction<T>>,
//     handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//   ) => React.ReactNode;
// }) => {
//   const [data, setData] = useState(initialData);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       await onSubmit(data);
//       alert(`${title} creado exitosamente`);
//       setData(initialData);
//     } catch (error: any) {
//       setError(`Error al crear el ${title.toLowerCase()}`);
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4">
//       <h1>{title}</h1>
//       {children(data, setData, handleChange)}
//       {error && <p className="text-red-500">{error}</p>}
//       <button type="submit" disabled={loading}>
//         {loading ? "Cargando..." : `CREAR ${title.toUpperCase()}`}
//       </button>
//     </form>
//   );
// };

// export default function CreateRole() {
//   const handleSubmitTeacher = async (teacherData: TeacherData) => {
//     await api.post("/teachers", teacherData);
//   };

//   const handleSubmitStudent = async (studentData: StudentData) => {
//     await api.post("/students", studentData);
//   };

//   return (
//     <div>
//       <Form
//         title="ROL DOCENTE"
//         initialData={{ user_id: 0, specialty: "", academic_degree: "" }}
//         onSubmit={handleSubmitTeacher}
//       >
//         {({ user_id, specialty, academic_degree }, _, handleChange) => (
//           <>
//             <label>ID USUARIO</label>
//             <input
//               type="number"
//               name="user_id"
//               value={user_id}
//               onChange={handleChange}
//               required
//             />
//             <label>ESPECIALIDAD</label>
//             <input
//               type="text"
//               name="specialty"
//               value={specialty}
//               onChange={handleChange}
//               required
//             />
//             <label>NIVEL ACADEMICO</label>
//             <input
//               type="text"
//               name="academic_degree"
//               value={academic_degree}
//               onChange={handleChange}
//               required
//             />
//           </>
//         )}
//       </Form>

//       <Form
//         title="ROL ESTUDIANTE"
//         initialData={{ user_id: 0, grade: "", section: "" }}
//         onSubmit={handleSubmitStudent}
//       >
//         {({ user_id, grade, section }, _, handleChange) => (
//           <>
//             <label>ID USUARIO</label>
//             <input
//               type="number"
//               name="user_id"
//               value={user_id}
//               onChange={handleChange}
//               required
//             />
//             <label>GRADO</label>
//             <input
//               type="text"
//               name="grade"
//               value={grade}
//               onChange={handleChange}
//               required
//             />
//             <label>SECCION</label>
//             <input
//               type="text"
//               name="section"
//               value={section}
//               onChange={handleChange}
//               required
//             />
//           </>
//         )}
//       </Form>
//     </div>
//   );
// }
