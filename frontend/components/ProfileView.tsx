'use client';

import { useState, useEffect } from 'react';

export default function ProfileView() {
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('');
    const [restrictions, setRestrictions] = useState('');
    const [frequency, setFrequency] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch current user data when component mounts
        const fetchUser = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/api/user');
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setName(data.name || '');
                        setGoal(data.goal || '');
                        setRestrictions(data.restrictions || '');
                        setFrequency(data.frequency?.toString() || '');
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('http://127.0.0.1:8000/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    goal,
                    restrictions,
                    frequency: parseInt(frequency) || 0
                }),
            });

            if (res.ok) {
                setMessage('Profilo aggiornato con successo!');
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
        <div className="flex flex-col items-center h-full p-6 space-y-6 overflow-y-auto pb-24">
            <h1 className="text-3xl font-bold text-accent">Profilo Utente</h1>
            <p className="text-gray-300 text-center">Gestisci le tue informazioni e obiettivi.</p>

            {message && (
                <div className={`p-3 rounded-lg w-full max-w-md text-center ${message.includes('Errore') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 text-left">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Il tuo nome"
                        className="w-full bg-card border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Obiettivo</label>
                    <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full bg-card border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none"
                        required
                    >
                        <option value="">Seleziona...</option>
                        <option value="lose_weight">Dimagrire</option>
                        <option value="gain_muscle">Aumentare Massa</option>
                        <option value="maintain">Mantenimento</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Restrizioni Alimentari</label>
                    <input
                        type="text"
                        value={restrictions}
                        onChange={(e) => setRestrictions(e.target.value)}
                        placeholder="Es. Celiaco, Vegano..."
                        className="w-full bg-card border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Allenamenti a settimana</label>
                    <input
                        type="number"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        placeholder="Es. 3"
                        className="w-full bg-card border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none"
                        required
                    />
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
