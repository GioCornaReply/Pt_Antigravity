'use client';

import MuscleCalendar from './MuscleCalendar';
import CostTracker from './CostTracker';

interface HomeViewProps {
    userName?: string;
    onSelectDate: (date: Date) => void;
}

export default function HomeView({ userName, onSelectDate }: HomeViewProps) {
    return (
        <div className="flex flex-col h-full gap-4">
            {/* Top: Calendar (Expanded) */}
            <div className="flex-1 min-h-[55%]">
                <MuscleCalendar onSelectDate={onSelectDate} />
            </div>

            {/* Bottom: Weekly Progress & Next Workout */}
            <div className="h-[40%] flex gap-3">
                {/* Weekly Goal */}
                <div className="w-1/3 bg-card rounded-3xl border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full"></div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Settimana</p>
                        <h3 className="text-3xl font-bold text-white mt-1">1/3</h3>
                    </div>
                    <div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full w-1/3"></div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">Obiettivo: 3 allenamenti</p>
                    </div>
                </div>

                {/* Next Workout Preview */}
                <div className="flex-1 bg-card rounded-3xl border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-accent/50 transition-colors"
                    onClick={() => onSelectDate(new Date())} // Shortcut to today/next
                >
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/5 rounded-tl-full group-hover:bg-accent/10 transition-colors"></div>

                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-accent uppercase tracking-wider font-bold">Prossimo Allenamento</p>
                            <h2 className="text-2xl font-bold text-white mt-1">Petto & Tricipiti</h2>
                        </div>
                        <span className="text-2xl">🦍</span>
                    </div>

                    <div className="space-y-1 relative z-10">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                            <span>Panca Piana (4x8)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                            <span>Croci Manubri (3x12)</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">+ altri 2 esercizi</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
