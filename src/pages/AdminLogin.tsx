
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // Assuming you have this client

export const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const { data: user, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

            if (signInError) throw signInError;

            // Check if user is in AdminUsers collection
            const { data: adminUser, error: adminError } = await supabase
                .from('adminUsers')
                .select('email')
                .eq('email', email)
                .single();

            if (adminError || !adminUser) {
                await supabase.auth.signOut();
                setError('Unauthorized: You do not have admin access.');
                return;
            }
            
            navigate('/admin/dashboard');

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto py-12">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold">Admin Login</h2>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-200 p-3 rounded-lg" required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-200 p-3 rounded-lg" required />
                    <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition">Login</button>
                </form>
            </div>
        </div>
    );
};
