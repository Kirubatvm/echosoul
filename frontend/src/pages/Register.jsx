import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');

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
    <form onSubmit={submit} style={{padding:16,maxWidth:360}}>
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} style={{display:'block',marginBottom:8,width:'100%'}} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{display:'block',marginBottom:8,width:'100%'}} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{display:'block',marginBottom:8,width:'100%'}} />
      {err && <div style={{color:'red',marginBottom:8}}>{err}</div>}
      <button type="submit">Create account</button>
    </form>
  );
}
