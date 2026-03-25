import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import Navbar from '../components/Navbar';

const SecurityScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' or 'result'

  useEffect(() => {
    let scanner;
    if (activeTab === 'scan') {
      scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render(handleScan, handleError);
    }
    return () => {
      if (scanner) {
        scanner.clear().catch(error => console.error('Failed to clear scanner.', error));
      }
    };
  }, [activeTab]);

  const handleScan = async (decodedText) => {
    if (activeTab === 'result') return; // Prevent multiple scans
    setActiveTab('result');
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/scan/validate', { qrToken: decodedText });
      setScanResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid QR code or scanner error');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err) => {
    // Ignore frequent scan errors when no QR is in view
  };

  const handleMarkAction = async (action) => {
    if (!scanResult || !scanResult.visitor) return;
    try {
      await axios.post(`http://localhost:5000/scan/${action}`, { visitorId: scanResult.visitor._id });
      alert(`Visitor marked as ${action === 'entry' ? 'Entered' : 'Exited'} successfully!`);
      resetScanner();
    } catch(err) {
      alert(err.response?.data?.error || 'Error marking action');
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError('');
    setActiveTab('scan');
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <h2>Security Guard Scanner</h2>

        <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', marginTop: '24px', textAlign: 'center' }}>
          {activeTab === 'scan' && (
            <div>
              <p style={{ marginBottom: '16px', opacity: 0.8 }}>Point your camera at the visitor's QR code</p>
              <div id="reader" style={{ width: '100%', background: 'white', color: 'black' }}></div>
            </div>
          )}

          {activeTab === 'result' && (
            <div>
              {loading && <p>Validating QR Code...</p>}
              
              {error && (
                <div>
                  <div style={{ color: 'var(--error)', fontSize: '1.2rem', marginBottom: '16px' }}>❌ {error}</div>
                  <button className="btn btn-primary" onClick={resetScanner}>Scan Again</button>
                </div>
              )}

              {scanResult && scanResult.isValid && (
                <div>
                  <div style={{ color: 'var(--success)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
                    ✅ Valid Pass
                  </div>
                  <h3>{scanResult.visitor.visitorName}</h3>
                  <p style={{ opacity: 0.8 }}>Host: {scanResult.visitor.hostId?.name}</p>
                  <p style={{ opacity: 0.8, marginBottom: '24px' }}>Purpose: {scanResult.visitor.purpose}</p>

                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button className="btn btn-success" onClick={() => handleMarkAction('entry')}>Mark Entry</button>
                    <button className="btn btn-error" onClick={() => handleMarkAction('exit')}>Mark Exit</button>
                  </div>
                  <br />
                  <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginTop: '16px' }} onClick={resetScanner}>
                    Cancel / Scan New
                  </button>
                </div>
              )}

              {scanResult && !scanResult.isValid && (
                <div>
                  <div style={{ color: 'var(--error)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
                    ❌ {scanResult.reason}
                  </div>
                  <h3>{scanResult.visitor.visitorName}</h3>
                  <p style={{ opacity: 0.8, marginBottom: '24px' }}>Host: {scanResult.visitor.hostId?.name}</p>

                  <button className="btn btn-primary" onClick={resetScanner}>Scan Again</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SecurityScanner;
