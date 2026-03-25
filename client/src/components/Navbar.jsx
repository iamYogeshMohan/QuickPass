import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        <span style={{ color: 'var(--primary)' }}>Quick</span>Pass
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ opacity: 0.8, fontSize: '0.9rem' }}>{user?.name} ({user?.role})</span>
        <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
