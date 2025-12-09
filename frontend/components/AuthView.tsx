'use client';

import { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, Check } from 'lucide-react';

interface AuthViewProps {
    onLogin: (user: any) => void;
}

export default function AuthView({ onLogin }: AuthViewProps) {
    const [view, setView] = useState<'login' | 'signup'>('login');
    const [showPassword, setShowPassword] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (view === 'signup') {
            if (password !== confirmPassword) {
                setError('Le password non coincidono');
                return;
            }
            if (!agreePrivacy) {
                setError('Devi accettare la Privacy Policy');
                return;
            }
        }

        setLoading(true);

        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: view === 'login' ? 'login' : 'register',
                    email,
                    password,
                    name: view === 'signup' ? `${firstName} ${lastName}`.trim() : undefined
                })
            });

            const data = await res.json();

            if (res.ok) {
                onLogin(data);
            } else {
                setError(data.error || 'Errore durante l\'autenticazione');
            }
        } catch (e: any) {
            setError(`Errore di connessione: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-full w-full bg-[#181920] text-white p-6">
            <div className="w-full max-w-md space-y-8">

                {/* Header */}
                <div className="text-left space-y-2">
                    <h1 className="text-3xl font-bold">{view === 'login' ? 'Log In' : 'Sign Up'}</h1>
                    <p className="text-gray-400 text-sm">
                        {view === 'login' ? 'Bentornato! Accedi al tuo account.' : 'Crea il tuo account per iniziare.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {view === 'signup' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 ml-1">First Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full bg-transparent border border-gray-600 rounded-xl p-3 text-white focus:border-[#FF4B6E] outline-none transition-colors"
                                        placeholder="Mario"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 ml-1">Last Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full bg-transparent border border-gray-600 rounded-xl p-3 text-white focus:border-[#FF4B6E] outline-none transition-colors"
                                        placeholder="Rossi"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border border-gray-600 rounded-xl p-3 pl-10 text-white focus:border-[#FF4B6E] outline-none transition-colors"
                                placeholder="mario@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border border-gray-600 rounded-xl p-3 pl-10 pr-10 text-white focus:border-[#FF4B6E] outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-500 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {view === 'signup' && (
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-transparent border border-gray-600 rounded-xl p-3 pl-10 text-white focus:border-[#FF4B6E] outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Options Row */}
                    <div className="flex items-center justify-between text-sm">
                        {view === 'login' ? (
                            <>
                                <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-[#FF4B6E] border-[#FF4B6E]' : 'border-gray-600'}`}>
                                        {rememberMe && <Check size={14} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    Remember me
                                </label>
                                <button type="button" className="text-[#FF4B6E] hover:underline">
                                    Forgot Password?
                                </button>
                            </>
                        ) : (
                            <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreePrivacy ? 'bg-[#FF4B6E] border-[#FF4B6E]' : 'border-gray-600'}`}>
                                    {agreePrivacy && <Check size={14} className="text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={agreePrivacy}
                                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                                />
                                I Agree with <span className="text-[#FF4B6E]">privacy</span> and <span className="text-[#FF4B6E]">policy</span>
                            </label>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF4B6E] text-white font-bold py-4 rounded-xl hover:bg-[#ff335a] transition-all shadow-[0_4px_20px_rgba(255,75,110,0.3)] disabled:opacity-70 flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            view === 'login' ? 'Log in' : 'Sign up'
                        )}
                    </button>
                </form>

                {/* Footer / Switch View */}
                <div className="space-y-8 text-center">
                    {view === 'login' && (
                        <div className="space-y-4">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <span className="relative bg-[#181920] px-4 text-gray-500 text-sm">Or Sign in with</span>
                            </div>

                            <div className="flex justify-center gap-4">
                                {/* Placeholder Social Icons */}
                                {['G', 'f', 'in'].map((social) => (
                                    <button key={social} className="w-12 h-12 rounded-xl border border-gray-700 flex items-center justify-center text-gray-400 hover:border-[#FF4B6E] hover:text-[#FF4B6E] transition-colors bg-[#1F2029]">
                                        <span className="font-bold text-lg">{social}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="text-sm text-gray-400">
                        {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setView(view === 'login' ? 'signup' : 'login');
                                setError('');
                            }}
                            className="text-[#FF4B6E] font-bold hover:underline"
                        >
                            {view === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
