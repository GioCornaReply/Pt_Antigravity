'use client';

import { useState } from 'react';
import { User, Lock, Mail, ArrowRight, Dumbbell } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center h-full p-8 relative overflow-hidden bg-black">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="z-10 w-full max-w-sm flex flex-col items-center space-y-8">
                {/* Logo Section */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-accent to-blue-600 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(41,203,232,0.5)] transform rotate-3">
                        <Dumbbell size={48} className="text-black transform -rotate-3" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-white tracking-tight">PT Gym</h1>
                        <p className="text-gray-400 font-medium">Il tuo coach digitale</p>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="w-full space-y-4 backdrop-blur-md bg-white/5 p-6 rounded-3xl border border-white/10 shadow-xl">
                    <div className="space-y-4">
                        {!isLogin && (
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Nome Completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-accent to-blue-500 text-black font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(41,203,232,0.4)] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Accedi' : 'Inizia Ora'}
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                {/* Toggle Section */}
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                    }}
                    className="text-gray-400 text-sm hover:text-white transition-colors flex items-center gap-1 group"
                >
                    {isLogin ? 'Nuovo qui?' : 'Hai già un account?'}
                    <span className="text-accent underline decoration-transparent group-hover:decoration-accent transition-all">
                        {isLogin ? 'Crea un account' : 'Accedi'}
                    </span>
                </button>
            </div>
        </div>
    );
}
