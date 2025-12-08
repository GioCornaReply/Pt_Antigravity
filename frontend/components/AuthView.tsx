'use client';

import { useState } from 'react';
import { User, Lock, Mail, Camera } from 'lucide-react';

interface AuthViewProps {
    onLogin: (user: any) => void;
}

export default function AuthView({ onLogin }: AuthViewProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: isLogin ? 'login' : 'register',
                    email,
                    password,
                    name: isLogin ? undefined : name
                })
            });

            const data = await res.json();

            if (res.ok) {
                onLogin(data);
            } else {
                setError(data.error || 'Errore durante l\'autenticazione');
            }
        } catch (e) {
            setError('Errore di connessione');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8">
            <div className="space-y-2">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={40} className="text-accent" />
                </div>
                <h1 className="text-4xl font-bold text-white">PT Gym</h1>
                <p className="text-gray-400">Il tuo Personal Trainer AI</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                {!isLogin && (
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-card border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-accent outline-none"
                            required
                        />
                    </div>
                )}

                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-card border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-accent outline-none"
                        required
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-card border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-accent outline-none"
                        required
                    />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-background font-bold py-3 rounded-xl hover:bg-accent/80 transition-colors shadow-[0_0_20px_rgba(41,203,232,0.4)] disabled:opacity-50"
                >
                    {loading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Registrati')}
                </button>
            </form>

            <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-400 text-sm hover:text-white transition-colors"
            >
                {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
            </button>
        </div>
    );
}
