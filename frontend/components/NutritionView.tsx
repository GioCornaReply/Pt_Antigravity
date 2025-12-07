'use client';

import { useState, useEffect } from 'react';

interface NutritionViewProps {
    date?: Date;
}

interface Meal {
    name: string;
    items: string[];
}

interface NutritionData {
    meals: Meal[];
}

export default function NutritionView({ date }: NutritionViewProps) {
    const [data, setData] = useState<NutritionData | null>(null);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const dateStr = date ? date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Oggi';
    const apiDate = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/nutrition?date=${apiDate}`);
                if (!res.ok) throw new Error("Errore nel caricamento dei dati");
                const json = await res.json();
                setData(json);
            } catch (e) {
                console.error(e);
                setError("Impossibile caricare il piano nutrizionale. Controlla la connessione.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [apiDate]);

    if (loading) return <div className="p-6 text-white">Caricamento...</div>;
    if (error) return <div className="p-6 text-red-400">{error}</div>;
    if (!data) return <div className="p-6 text-white">Nessun piano nutrizionale trovato.</div>;

    return (
        <div className="h-full bg-card rounded-t-3xl p-6 overflow-y-auto border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 capitalize">Piano Nutrizionale: {dateStr} 🥗</h2>

            <div className="space-y-4">
                {data.meals.map((meal, idx) => (
                    <div key={idx} className="bg-background/50 p-4 rounded-xl border border-white/5">
                        <h3 className="text-accent font-bold mb-2">{meal.name}</h3>
                        <ul className="text-gray-300 text-sm space-y-1 list-disc pl-4">
                            {meal.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}

                {data.meals.length === 0 && (
                    <p className="text-gray-400 text-center mt-10">Nessun pasto programmato per oggi.</p>
                )}
            </div>
        </div>
    );
}

