'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, Edit2, Check } from 'lucide-react';

export default function CostTracker() {
    const [totalCost, setTotalCost] = useState(120);
    const [sessions, setSessions] = useState(0);
    const [isEditingCost, setIsEditingCost] = useState(false);

    useEffect(() => {
        const savedSessions = localStorage.getItem('gym_sessions');
        if (savedSessions) setSessions(parseInt(savedSessions));

        const savedCost = localStorage.getItem('gym_total_cost');
        if (savedCost) setTotalCost(parseFloat(savedCost));
    }, []);

    const updateSessions = (delta: number) => {
        const newSessions = Math.max(1, sessions + delta);
        setSessions(newSessions);
        localStorage.setItem('gym_sessions', newSessions.toString());
    };

    const saveCost = () => {
        setIsEditingCost(false);
        localStorage.setItem('gym_total_cost', totalCost.toString());
    };

    const costPerSession = sessions > 0 ? (totalCost / sessions).toFixed(2) : totalCost;

    return (
        <div className="bg-card p-4 rounded-xl flex flex-col justify-between h-full text-white shadow-lg relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>

            <div>
                <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Costo / Seduta</h3>
                <div className="flex items-baseline mt-1">
                    <span className="text-3xl font-bold text-accent">€{costPerSession}</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                    {isEditingCost ? (
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                value={totalCost}
                                onChange={(e) => setTotalCost(parseFloat(e.target.value) || 0)}
                                className="w-16 bg-white/10 rounded px-1 text-xs text-white focus:outline-none border border-accent/50"
                            />
                            <button onClick={saveCost} className="text-green-400 hover:text-green-300">
                                <Check size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 group cursor-pointer" onClick={() => setIsEditingCost(true)}>
                            <p className="text-[10px] text-gray-500">
                                {sessions} allenamenti / €{totalCost} tot
                            </p>
                            <Edit2 size={10} className="text-gray-600 group-hover:text-accent transition-colors" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-3 mt-2">
                <button
                    onClick={() => updateSessions(-1)}
                    className="flex-1 bg-background/50 hover:bg-background text-white py-2 rounded-lg flex items-center justify-center transition-colors border border-white/10"
                >
                    <Minus size={18} />
                </button>
                <button
                    onClick={() => updateSessions(1)}
                    className="flex-1 bg-accent hover:bg-accent/90 text-background font-bold py-2 rounded-lg flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(41,203,232,0.3)]"
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
}

