'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, User } from 'lucide-react';

interface ProfileViewProps {
    user: any;
    onUpdate: (updatedUser: any) => void;
}

export default function ProfileView({ user, onUpdate }: ProfileViewProps) {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState(user?.password || '');
    const [goal, setGoal] = useState(user?.goal || '');
    const [restrictions, setRestrictions] = useState(user?.restrictions || '');
    const [frequency, setFrequency] = useState(user?.frequency?.toString() || '');
    const [image, setImage] = useState(user?.image_url || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update',
                    id: user.id,
                    name,
                    email,
                    password,
                    goal,
                    restrictions,
                    frequency: parseInt(frequency) || 0,
                    image_url: image
                }),
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setMessage('Profilo aggiornato con successo!');
                onUpdate(updatedUser);
            } else {
                const errorText = await res.text();
                setMessage(`Errore: ${errorText}`);
            }
        } catch (error: any) {
            setMessage(`Errore di connessione: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center h-full p-6 space-y-6 overflow-y-auto pb-24 pt-16">

            {/* Profile Image Section */}
            <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-card border-2 border-accent/50 overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(41,203,232,0.3)]">
                    {image ? (
                        <img src={image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User size={64} className="text-gray-400" />
                    )}
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-accent text-black p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
                >
                    <Camera size={20} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            <h1 className="text-2xl font-bold text-white">{name}</h1>

            {message && (
                <div className={`p-3 rounded-lg w-full max-w-md text-center text-sm ${message.includes('Errore') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 text-left">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Account</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full bg-card border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none mb-2"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-card border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Personale</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome Completo"
                            className="w-full bg-card border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Fitness</label>
                        <select
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="w-full bg-card border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none mb-2"
                        >
                            <option value="">Seleziona Obiettivo...</option>
                            <option value="lose_weight">Dimagrire</option>
                            <option value="gain_muscle">Aumentare Massa</option>
                            <option value="maintain">Mantenimento</option>
                        </select>
                        <input
                            type="text"
                            value={restrictions}
                            onChange={(e) => setRestrictions(e.target.value)}
                            placeholder="Restrizioni (es. Vegano)"
                            className="w-full bg-card border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none mb-2"
                        />
                        <input
                            type="number"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            placeholder="Allenamenti a settimana"
                            className="w-full bg-card border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-background font-bold py-3 rounded-xl hover:bg-accent/80 transition-colors shadow-[0_0_15px_rgba(41,203,232,0.4)] disabled:opacity-50 mt-4"
                >
                    {loading ? 'Salvataggio...' : 'Salva Modifiche'}
                </button>
            </form>
        </div>
    );
}
