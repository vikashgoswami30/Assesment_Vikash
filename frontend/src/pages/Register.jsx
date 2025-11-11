import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Register(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [msg,setMsg]=useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const resp = await fetch('http://localhost:5000/auth/register', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, password })
    });
    const data = await resp.json();
    if (!resp.ok) { setMsg(data.message || 'Error'); return; }
    setMsg('Registered! Go to login.');
    setTimeout(()=>nav('/login'), 1000);
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" /><br/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /><br/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" /><br/>
        <button>Register</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
