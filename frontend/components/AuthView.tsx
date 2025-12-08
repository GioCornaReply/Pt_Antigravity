'use client';

import { useState } from 'react';
import { Dumbbell, ArrowRight } from 'lucide-react';

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
                // Show the specific error from the server if available
                setError(data.error || 'Errore sconosciuto');
            }
        } catch (e: any) {
            setError(`Errore di connessione: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-white relative overflow-hidden">

            {/* Top Section (Dark) */}
            <div className="relative h-[40%] bg-black flex flex-col items-center justify-center text-white z-10">
                {/* Background Pattern (Subtle) */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700 via-black to-black"></div>

                <div className="z-20 flex flex-col items-center animate-fade-in-down">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-2xl transform rotate-3">
                        <Dumbbell size={40} className="text-black transform -rotate-3" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">PT Gym</h1>
                    <p className="text-gray-400 text-sm mt-1">Il tuo coach digitale</p>
                </div>
            </div>

            {/* Curved Divider */}
            <div className="absolute top-[35%] left-0 w-full z-20 overflow-hidden leading-[0]">
                <svg className="relative block w-[calc(100%+1.3px)] h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-black"></path>
                </svg>
            </div>

            {/* Bottom Section (White/Form) */}
            <div className="flex-1 bg-white px-8 pt-12 pb-8 flex flex-col justify-between z-10">

                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">{isLogin ? 'Login' : 'Registrati'}</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {isLogin ? 'Bentornato! Accedi per continuare.' : 'Crea il tuo account per iniziare.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 ml-1">Nome</label>
                                <input
                                    type="text"
                                    placeholder="Mario Rossi"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-100 border-transparent focus:bg-white border-2 focus:border-black rounded-xl p-4 text-gray-900 outline-none transition-all font-medium placeholder-gray-400"
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 ml-1">Email</label>
                            <input
                                type="email"
                                placeholder="mario@esempio.it"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-100 border-transparent focus:bg-white border-2 focus:border-black rounded-xl p-4 text-gray-900 outline-none transition-all font-medium placeholder-gray-400"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 ml-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-100 border-transparent focus:bg-white border-2 focus:border-black rounded-xl p-4 text-gray-900 outline-none transition-all font-medium placeholder-gray-400"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Accedi' : 'Registrati'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-4">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="text-sm text-gray-500 hover:text-black transition-colors font-medium"
                    >
                        {isLogin ? 'Non hai un account? ' : 'Hai già un account? '}
                        <span className="text-black font-bold underline decoration-2 decoration-transparent hover:decoration-black transition-all">
                            {isLogin ? 'Registrati' : 'Accedi'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
