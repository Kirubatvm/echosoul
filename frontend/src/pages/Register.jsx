import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await register({ username, email, password });
      nav('/');
    } catch (e) {
      setErr('Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {err && <div className="error">{err}</div>}
        <button className="btn" type="submit" style={{ width: '100%', marginTop: 12 }}>
          Create Account
        </button>
      </form>
    </div>
  );
}
