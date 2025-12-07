'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Send, Mic } from 'lucide-react';

interface WorkoutViewProps {
    date?: Date;
}

interface Exercise {
    name: string;
    sets: string;
    rest: string;
    notes: string;
}

interface WorkoutData {
    muscle: string;
    exercises: Exercise[];
}

export default function WorkoutView({ date }: WorkoutViewProps) {
    const [data, setData] = useState<WorkoutData | null>(null);
    const [loading, setLoading] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [logInput, setLogInput] = useState('');

    const toggleListening = (setter: (val: string) => void) => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.lang = 'it-IT';
                recognition.start();
                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setter(transcript);
                };
            } else {
                alert("Browser non supportato per comandi vocali.");
            }
        }
    };

    const dateStr = date ? date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Oggi';
    const apiDate = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/workout?date=${apiDate}`);
                const json = await res.json();
                setData(json);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [apiDate]);

    const [feedback, setFeedback] = useState<string | null>(null);

    const handleLog = async (exerciseName: string) => {
        if (!logInput.trim()) return;
        try {
            const res = await fetch('/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'workout', content: `Esercizio: ${exerciseName}. ${logInput}` })
            });
            const json = await res.json();
            setFeedback(json.analysis);
            setTimeout(() => setFeedback(null), 3000);
            setLogInput('');
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-6 text-white">Caricamento...</div>;
    if (!data) return <div className="p-6 text-white">Nessun allenamento trovato.</div>;

    return (
        <div className="h-full bg-card rounded-t-3xl p-6 overflow-y-auto border-t border-white/10 relative">
            {feedback && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-down">
                    {feedback}
                </div>
            )}
            <h2 className="text-2xl font-bold text-white mb-4 capitalize">Scheda: {dateStr} <span className="text-accent">({data.muscle})</span></h2>

            <div className="space-y-4">
                {data.exercises.map((ex, idx) => (
                    <div key={idx} className="bg-background/50 rounded-xl border border-white/5 overflow-hidden">
                        <div
                            className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                        >
                            <div>
                                <h3 className="text-white font-bold">{ex.name}</h3>
                                <span className="text-accent text-sm font-mono">{ex.sets}</span>
                            </div>
                            {expandedIndex === idx ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                        </div>

                        {expandedIndex === idx && (
                            <div className="px-4 pb-4 border-t border-white/5 pt-2">
                                <p className="text-gray-400 text-xs mb-1">Recupero: {ex.rest}</p>
                                <p className="text-gray-400 text-xs mb-3">{ex.notes}</p>

                                <div className="flex gap-2 relative">
                                    <input
                                        type="text"
                                        value={logInput}
                                        onChange={(e) => setLogInput(e.target.value)}
                                        placeholder="Es. Fatto 80kg, tutto ok..."
                                        className="flex-1 bg-black/20 rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleListening(setLogInput); }}
                                        className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent p-1"
                                    >
                                        <Mic size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleLog(ex.name); }}
                                        className="bg-accent text-background p-2 rounded-lg hover:bg-accent/80 transition-colors"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {data.exercises.length === 0 && (
                    <p className="text-gray-400 text-center mt-10">Nessun esercizio programmato per oggi.</p>
                )}
            </div>
        </div>
    );
}

