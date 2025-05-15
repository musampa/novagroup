import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    } else {
      alert("Inserisci username e password!");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #e0e0e0 0%, #d3eaff 100%)' }}>
      <img src="/src/assets/logo.jpg" alt="Nova Group Logo" style={{ height: 60, marginBottom: 24, borderRadius: 10, background: 'rgba(255,255,255,0.7)', boxShadow: '0 2px 8px #0001' }} />
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(255,255,255,0.55)',
        borderRadius: 18,
        padding: 36,
        boxShadow: '0 2px 24px #0002',
        color: '#222',
        maxWidth: 340,
        width: '100%',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backdropFilter: 'blur(8px)',
      }}>
        <h2 style={{ textTransform: 'uppercase', fontSize: 30, letterSpacing: 1, fontWeight: 700, color: '#1a2a3a', marginBottom: 24, textAlign: 'center' }}>Login</h2>
        <div style={{ width: '100%', marginBottom: 24, borderRadius: 10, background: 'rgba(255,255,255,0.45)', boxShadow: '0 1px 8px #0001', padding: 8, transition: 'background 0.2s' }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            variant="standard"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ input: { color: '#1a2a3a' }, label: { color: '#51cbce' } }}
          />
        </div>
        <div style={{ width: '100%', marginBottom: 24, borderRadius: 10, background: 'rgba(255,255,255,0.45)', boxShadow: '0 1px 8px #0001', padding: 8, transition: 'background 0.2s' }}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="standard"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ input: { color: '#1a2a3a' }, label: { color: '#51cbce' } }}
          />
        </div>
        <Button type="submit" variant="contained" style={{ background: '#51cbce', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 16, marginTop: 8, width: '100%', boxShadow: '0 2px 8px #51cbce44' }}>
          Login
        </Button>
      </form>
    </div>
  );
}