import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import '../css/StudentManagement.css';

const StudentManagement = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', lastname: '', email: '', password: '' });
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [axiosPrivate]);

  const fetchStudents = async () => {
    try {
      const response = await axiosPrivate.get('/users/students'); // Cambiar a /users/students
      setStudents(response.data); // No necesitamos filtrar, el backend ya devuelve solo alumnos
      setErrMsg('');
    } catch (err) {
      setErrMsg('Failed to fetch students: ' + (err.response?.data || err.message));
      console.error(err);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post('/users/students', newStudent);
      setStudents([...students, response.data]);
      setNewStudent({ name: '', lastname: '', email: '', password: '' });
      setErrMsg('');
    } catch (err) {
      setErrMsg('Failed to create student: ' + (err.response?.data || err.message));
      console.error(err);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axiosPrivate.delete(`/users/${id}`);
        setStudents(students.filter(s => s.id !== id));
        setErrMsg('');
      } catch (err) {
        setErrMsg('Failed to delete student: ' + (err.response?.data || err.message));
        console.error(err);
      }
    }
  };

  return (
    <section className="student-management-section">
      <h1>Student Management</h1>
      {errMsg && <p className="error">{errMsg}</p>}

      <form onSubmit={handleCreateStudent}>
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Lastname"
          value={newStudent.lastname}
          onChange={(e) => setNewStudent({ ...newStudent, lastname: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newStudent.email}
          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newStudent.password}
          onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
          required
        />
        <button type="submit">Create Student</button>
      </form>

      {students.length > 0 ? (
        <ul>
          {students.map(student => (
            <li key={student.id}>
              <span>{student.name} {student.lastname} ({student.email})</span>
              <button onClick={() => handleDeleteStudent(student.id)} style={{ backgroundColor: '#EF5350' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No students to display</p>
      )}
    </section>
  );
};

export default StudentManagement;