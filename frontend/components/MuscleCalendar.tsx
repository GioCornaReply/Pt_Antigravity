'use client';

interface MuscleCalendarProps {
    onSelectDate?: (date: Date) => void;
}

export default function MuscleCalendar({ onSelectDate }: MuscleCalendarProps) {
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const currentDay = today.getDate();

    // Mock data for muscle groups (matches backend cycle)
    // Cycle: Petto -> Schiena -> Gambe -> Riposo
    const days = Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const cycle = day % 4;

        let muscle = '';
        let emoji = '';

        if (cycle === 1) { muscle = 'Petto'; emoji = '🦍'; }
        if (cycle === 2) { muscle = 'Schiena'; emoji = '🐢'; }
        if (cycle === 3) { muscle = 'Gambe'; emoji = '🦖'; }
        if (cycle === 0) { muscle = 'Riposo'; emoji = '💤'; }

        return { day, muscle, emoji };
    });

    const handleDayClick = (day: number) => {
        if (onSelectDate) {
            const date = new Date(today.getFullYear(), today.getMonth(), day);
            onSelectDate(date);
        }
    };

    return (
        <div className="bg-card p-4 rounded-xl h-full flex flex-col border border-white/5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight capitalize">{currentMonth}</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Programma Mensile</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold text-accent">{currentDay}</span>
                    <span className="text-xs text-gray-400 block">Oggi</span>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-gray-500 mb-2 font-medium">
                <div>L</div><div>M</div><div>M</div><div>G</div><div>V</div><div>S</div><div>D</div>
            </div>

            <div className="grid grid-cols-7 gap-2 overflow-y-auto pr-1 custom-scrollbar pb-2">
                {days.map((d) => (
                    <button
                        key={d.day}
                        onClick={() => handleDayClick(d.day)}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105 ${d.day === currentDay
                            ? 'bg-accent text-background shadow-[0_0_10px_rgba(41,203,232,0.5)] ring-2 ring-accent ring-offset-2 ring-offset-card'
                            : 'bg-white/5 hover:bg-white/10 text-gray-300'
                            }`}
                    >
                        <span className="text-xs font-bold opacity-50">{d.day}</span>
                        <span className="text-xl leading-none my-0.5">{d.emoji}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wide w-full truncate ${d.muscle === 'Riposo' ? 'text-green-400' : 'text-white/90'}`}>
                            {d.muscle}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
