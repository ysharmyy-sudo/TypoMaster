import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSection from '../components/ProfileSection';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <ProfileSection />
      </div>
    </div>
  );
};

export default Dashboard;

