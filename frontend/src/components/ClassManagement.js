import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import '../css/ClassManagement.css';

const ClassManagement = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [classes, setClasses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [newClass, setNewClass] = useState({ name: '', code: '', description: '', professorId: '' });
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    fetchClasses();
    fetchProfessors();
    if (auth.role === 'ADMIN') fetchStudents();
  }, [axiosPrivate]);

  const fetchClasses = async () => {
    try {
      const response = await axiosPrivate.get('/classes');
      setClasses(response.data);
    } catch (err) {
      setErrMsg('Failed to fetch classes');
      console.error(err);
    }
  };

  const fetchProfessors = async () => {
    try {
      const response = await axiosPrivate.get('/users/professors');
      setProfessors(response.data);
      if (auth.role === 'PROFESOR' && response.data.length > 0) {
        setNewClass(prev => ({ ...prev, professorId: response.data[0].id.toString() }));
      }
    } catch (err) {
      setErrMsg('Failed to fetch professors');
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axiosPrivate.get('/users/list');
      setStudents(response.data.filter(u => u.role === 'ALUMNO'));
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClass.professorId) {
      setErrMsg('Please select a professor');
      return;
    }
    try {
      const classData = {
        name: newClass.name,
        code: newClass.code,
        description: newClass.description,
        professor: { id: parseInt(newClass.professorId) }
      };
      const response = await axiosPrivate.post('/classes', classData);
      setClasses([...classes, response.data]);
      setNewClass({ name: '', code: '', description: '', professorId: auth.role === 'PROFESOR' ? professors[0]?.id.toString() : '' });
      setErrMsg('');
    } catch (err) {
      setErrMsg('Failed to create class: ' + (err.response?.data || err.message));
      console.error(err);
    }
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axiosPrivate.delete(`/classes/${id}`);
        setClasses(classes.filter(c => c.id !== id));
      } catch (err) {
        setErrMsg('Failed to delete class');
        console.error(err);
      }
    }
  };

  const handleAddStudent = async (classId, studentId) => {
    try {
      const response = await axiosPrivate.post(`/classes/${classId}/students`, { studentId });
      setClasses(classes.map(c => c.id === classId ? response.data : c));
      setSelectedClassId(null);
    } catch (err) {
      setErrMsg('Failed to add student');
      console.error(err);
    }
  };

  return (
    <section className="class-management-section">
      <h1>Class Management</h1>
      {errMsg && <p className="error">{errMsg}</p>}

      <form onSubmit={handleCreateClass}>
        <input
          type="text"
          placeholder="Class Name"
          value={newClass.name}
          onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Code"
          value={newClass.code}
          onChange={(e) => setNewClass({ ...newClass, code: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newClass.description}
          onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
        />
        <select
          value={newClass.professorId}
          onChange={(e) => setNewClass({ ...newClass, professorId: e.target.value })}
          required
          disabled={auth.role === 'PROFESOR'}
        >
          <option value="">Select Professor</option>
          {professors.map(prof => (
            <option key={prof.id} value={prof.id}>
              {prof.name} {prof.lastname} ({prof.email})
            </option>
          ))}
        </select>
        <button type="submit">Create Class</button>
      </form>

      {classes.length > 0 ? (
        <ul>
          {classes.map(cls => (
            <li key={cls.id}>
              <span>{cls.name} ({cls.code}) - {cls.description || 'No description'} (Prof: {cls.professor?.name})</span>
              <button onClick={() => handleDeleteClass(cls.id)} style={{ backgroundColor: '#EF5350' }}>
                Delete
              </button>
              <button onClick={() => setSelectedClassId(cls.id)}>
                Add Student
              </button>
              {selectedClassId === cls.id && (
                <select
                  onChange={(e) => handleAddStudent(cls.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Select Student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>{student.name} ({student.email})</option>
                  ))}
                </select>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No classes to display</p>
      )}
    </section>
  );
};

export default ClassManagement;