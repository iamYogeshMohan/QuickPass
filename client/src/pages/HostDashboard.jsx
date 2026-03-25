import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const HostDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ visitorName: '', phone: '', purpose: '', validFrom: '', validTo: '' });
  const [loading, setLoading] = useState(true);

  const fetchVisitors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/visitor/host/me');
      setVisitors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/visitor/create', formData);
      setShowForm(false);
      setFormData({ visitorName: '', phone: '', purpose: '', validFrom: '', validTo: '' });
      fetchVisitors();
    } catch (err) {
      alert('Error creating visitor pass');
    }
  };

  const copyLink = (id) => {
    const link = `${window.location.origin}/v/${id}`;
    navigator.clipboard.writeText(link);
    alert('Public Visitor Link copied to clipboard!');
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Host Dashboard</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create Pass'}
          </button>
        </div>

        {showForm && (
          <div className="glass-panel" style={{ marginBottom: '32px' }}>
            <h3>Create Visitor Pass</h3>
            <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div className="form-group">
                <label>Visitor Name</label>
                <input required type="text" value={formData.visitorName} onChange={e => setFormData({...formData, visitorName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Purpose of Visit</label>
                <input required type="text" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Valid From</label>
                <input required type="datetime-local" value={formData.validFrom} onChange={e => setFormData({...formData, validFrom: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Valid To</label>
                <input required type="datetime-local" value={formData.validTo} onChange={e => setFormData({...formData, validTo: e.target.value})} />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="submit" className="btn btn-success">Generate Pass</button>
              </div>
            </form>
          </div>
        )}

        {loading ? <p>Loading visitors...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {visitors.map(v => (
              <div key={v._id} className="glass-panel" style={{ position: 'relative' }}>
                <h4>{v.visitorName}</h4>
                <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '12px' }}>{v.purpose}</p>
                <div style={{ fontSize: '0.85rem', marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px' }}>
                  <div><strong>From:</strong> {new Date(v.validFrom).toLocaleString()}</div>
                  <div><strong>To:</strong> {new Date(v.validTo).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn" style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.1)', color: 'white' }} onClick={() => copyLink(v._id)}>
                    Copy Link
                  </button>
                  <a href={`/v/${v._id}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ flex: 1, padding: '8px', textAlign: 'center', textDecoration: 'none' }}>
                    View Pass
                  </a>
                </div>
              </div>
            ))}
            {visitors.length === 0 && <p style={{ opacity: 0.6 }}>No visitors yet. Create your first pass!</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default HostDashboard;
