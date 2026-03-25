import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import axios from 'axios';

const VisitorView = () => {
  const { id } = useParams();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVisitor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/visitor/${id}`);
        setVisitor(res.data);
      } catch (err) {
        setError('Visitor pass not found or invalid.');
      } finally {
        setLoading(false);
      }
    };
    fetchVisitor();
  }, [id]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>Loading Pass...</div>;
  if (error) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', color: 'var(--error)' }}>{error}</div>;

  const isActive = new Date() >= new Date(visitor.validFrom) && new Date() <= new Date(visitor.validTo);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '8px' }}>QuickPass Entry</h2>
        <p style={{ opacity: 0.7, marginBottom: '24px' }}>Show this QR code to the Security Guard</p>
        
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', display: 'inline-block', marginBottom: '24px' }}>
          <QRCode value={visitor.qrToken} size={200} />
        </div>

        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{visitor.visitorName}</h3>
        <p style={{ color: 'var(--primary)', marginBottom: '16px' }}>Host: {visitor.hostId?.name}</p>

        <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ opacity: 0.7 }}>Purpose:</span>
            <span>{visitor.purpose}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ opacity: 0.7 }}>Valid From:</span>
            <span>{new Date(visitor.validFrom).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.7 }}>Valid To:</span>
            <span>{new Date(visitor.validTo).toLocaleString()}</span>
          </div>
        </div>

        {!isActive && (
          <div style={{ marginTop: '16px', color: 'var(--error)', fontWeight: 'bold' }}>
            Pass is currently not in active window.
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorView;
