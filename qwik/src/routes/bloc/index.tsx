import { component$ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';

export default component$(() => {

  const loc = useLocation();
  const navigation = useNavigate();
  const ip = loc.url.searchParams.get('ip') || 'Unknown IP';
  const location = loc.url.searchParams.get('location') || 'Unknown Location';
  const network = loc.url.searchParams.get('network') || 'Unknown Network';

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        color: '#212529',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
          padding: '3rem',
        }}
      >
        <div style={{ fontSize: '2.5rem', textAlign: 'center' }}>🔒</div>

        <div
          style={{
            fontWeight: 700,
            fontSize: '1.5rem',
            color: '#4361ee',
            textAlign: 'center',
            margin: '1rem 0',
          }}
        >
          SecureAccess
        </div>

        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem', textAlign: 'center' }}>
          VPN/Proxy Access Restricted
        </h1>

        <div
          style={{
            background: 'rgba(247, 37, 133, 0.1)',
            borderLeft: '4px solid #f72585',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ color: '#f72585', fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <strong>Security Alert:</strong> VPN or proxy usage detected.
          </div>
        </div>

        <p style={{ color: '#6c757d', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          To protect our platform and user data, we restrict access from VPNs, proxies, or anonymous
          networks.
        </p>

        <div
          style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontFamily: 'monospace',
          }}
        >
          Detected IP: <span id="user-ip" style={{ color: '#4361ee', fontWeight: 600 }}>{ip}</span>
          <br />
          Location: <span>{location} (via VPN)</span>
          <br />
          Network: <span>{network}</span>
        </div>

        <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
          Please disable your VPN/proxy and refresh the page. If you think this is a mistake,
          contact support.
        </p>

        <button
          id="refresh-btn"
          style={{
            background: '#4361ee',
            color: '#fff',
            border: '2px solid #4361ee',
            padding: '0.8rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            marginBottom: '0.75rem',
          }}
          onClick$={() => {
            navigation("/");
          }}
        >
          🔄 Refresh Connection
        </button>

        <a
          href="mailto:huduma@mypostech.store"
          style={{
            display: 'block',
            textAlign: 'center',
            textDecoration: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '8px',
            color: '#4361ee',
            border: '2px solid #4361ee',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          ✉️ Contact Support
        </a>

        <div style={{ fontSize: '0.8rem', color: '#6c757d', textAlign: 'center' }}>
          &copy; 2025 myPosTech. All rights reserved.
        </div>
      </div>
    </div>
  );
});
