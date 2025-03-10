import { useNavigate } from 'react-router-dom';
import '../css/Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <section className="unauthorized-section">
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <button onClick={goBack}>Go Back</button>
    </section>
  );
};

export default Unauthorized;