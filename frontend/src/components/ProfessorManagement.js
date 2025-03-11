import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import '../css/ProfessorManagement.css';

const ProfessorManagement = () => {
  const axiosPrivate = useAxiosPrivate();
  const [professors, setProfessors] = useState([]);
  const [newProfessor, setNewProfessor] = useState({ name: '', lastname: '', email: '', password: '' });
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    fetchProfessors();
  }, [axiosPrivate]);

  const fetchProfessors = async () => {
    try {
      const response = await axiosPrivate.get('/users/professors');
      setProfessors(response.data);
    } catch (err) {
      setErrMsg('Failed to fetch professors');
      console.error(err);
    }
  };

  const handleCreateProfessor = async (e) => {
    e.preventDefault();
    try {
      const professorData = { ...newProfessor, role: 'PROFESOR' };
      const response = await axiosPrivate.post('/users', professorData);
      setProfessors([...professors, response.data]);
      setNewProfessor({ name: '', lastname: '', email: '', password: '' });
      setErrMsg('');
    } catch (err) {
      setErrMsg('Failed to create professor: ' + (err.response?.data || err.message));
      console.error(err);
    }
  };

  const handleDeleteProfessor = async (id) => {
    if (window.confirm('Are you sure you want to delete this professor?')) {
      try {
        await axiosPrivate.delete(`/users/${id}`);
        setProfessors(professors.filter(p => p.id !== id));
      } catch (err) {
        setErrMsg('Failed to delete professor');
        console.error(err);
      }
    }
  };

  return (
    <section className="professor-management-section">
      <h1>Professor Management</h1>
      {errMsg && <p className="error">{errMsg}</p>}

      <form onSubmit={handleCreateProfessor}>
        <input
          type="text"
          placeholder="Name"
          value={newProfessor.name}
          onChange={(e) => setNewProfessor({ ...newProfessor, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Lastname"
          value={newProfessor.lastname}
          onChange={(e) => setNewProfessor({ ...newProfessor, lastname: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newProfessor.email}
          onChange={(e) => setNewProfessor({ ...newProfessor, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newProfessor.password}
          onChange={(e) => setNewProfessor({ ...newProfessor, password: e.target.value })}
          required
        />
        <button type="submit">Create Professor</button>
      </form>

      {professors.length > 0 ? (
        <ul>
          {professors.map(professor => (
            <li key={professor.id}>
              <span>{professor.name} {professor.lastname} ({professor.email})</span>
              <button onClick={() => handleDeleteProfessor(professor.id)} style={{ backgroundColor: '#EF5350' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No professors to display</p>
      )}
    </section>
  );
};

export default ProfessorManagement;