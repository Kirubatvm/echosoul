import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      nav('/');
    } catch (e) {
      setErr('Invalid credentials');
    }
  };

  return (
    <form onSubmit={submit} style={{padding:16,maxWidth:360}}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{display:'block',marginBottom:8,width:'100%'}} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{display:'block',marginBottom:8,width:'100%'}} />
      {err && <div style={{color:'red',marginBottom:8}}>{err}</div>}
      <button type="submit">Login</button>
    </form>
  );
}
