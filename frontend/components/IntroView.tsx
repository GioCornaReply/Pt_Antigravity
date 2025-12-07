'use client';

import { useState } from 'react';

export default function IntroView({ onComplete }: { onComplete: (name: string) => void }) {
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('');
    const [restrictions, setRestrictions] = useState('');
    const [frequency, setFrequency] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const res = await fetch('http://127.0.0.1:8000/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    goal,
                    restrictions,
                    frequency: parseInt(frequency) || 0
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                onComplete(name);
            } else {
                const errorText = await res.text();
                console.error("Backend Error:", errorText);
                alert(`Errore del server: ${res.status} - ${errorText}`);
            }
        } catch (error: any) {
            console.error(error);
            if (error.name === 'AbortError') {
                alert('Timeout: Il server non risponde. Controlla che il backend sia avviato.');
            } else {
                alert(`Errore di connessione: ${error.message}. Assicurati che uvicorn sia in esecuzione.`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6 overflow-y-auto">
            <h1 className="text-3xl font-bold text-accent">Benvenuto in PT Gym!</h1>
            <p className="text-gray-300">Raccontami di te per iniziare.</p>

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 text-left">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Come ti chiami?</label>
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
                    <label className="block text-sm font-medium text-gray-400 mb-1">Qual è il tuo obiettivo?</label>
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
                    <label className="block text-sm font-medium text-gray-400 mb-1">Hai restrizioni alimentari?</label>
                    <input
                        type="text"
                        value={restrictions}
                        onChange={(e) => setRestrictions(e.target.value)}
                        placeholder="Es. Celiaco, Vegano..."
                        className="w-full bg-card border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Quante volte ti alleni a settimana?</label>
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
                    className="w-full bg-accent text-background font-bold py-3 rounded-xl hover:bg-accent/80 transition-colors shadow-[0_0_15px_rgba(41,203,232,0.4)] disabled:opacity-50"
                >
                    {loading ? 'Salvataggio...' : 'Inizia il percorso'}
                </button>
            </form>
        </div>
    );
}
