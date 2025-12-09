'use client';

import { Dumbbell, Activity, Flame, TrendingUp } from 'lucide-react';

interface HomeViewProps {
    userName?: string;
    onSelectDate: (date: Date) => void;
}

export default function HomeView({ userName, onSelectDate }: HomeViewProps) {
    return (
        <div className="flex flex-col h-full gap-4 pb-20">
            {/* Welcome Header */}
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-white">Ciao, {userName?.split(' ')[0] || 'Atleta'} 👋</h1>
                <p className="text-gray-400">Pronto a spaccare oggi?</p>
            </div>

            {/* Hero Card: Next Workout */}
            <div
                onClick={() => onSelectDate(new Date())}
                className="bg-[#1c1c1e] rounded-[2rem] p-6 relative overflow-hidden cursor-pointer group hover:bg-[#2c2c2e] transition-all border border-white/5 shadow-2xl"
            >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-[4rem] group-hover:bg-accent/20 transition-colors"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Oggi
                        </div>
                        <Dumbbell className="text-white/50 group-hover:text-white transition-colors" size={24} />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-1">Petto & Tricipiti</h2>
                    <p className="text-gray-400 text-sm mb-6">45 min • Alta Intensità</p>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">1</div>
                            <span>Panca Piana (4x8)</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">2</div>
                            <span>Croci Manubri (3x12)</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500 text-sm pl-1">
                            <span>+ altri 3 esercizi</span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-accent font-bold text-sm group-hover:translate-x-2 transition-transform">
                        Inizia Allenamento <TrendingUp size={16} />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 flex-1">
                {/* Weekly Goal */}
                <div className="bg-[#1c1c1e] rounded-[2rem] p-5 flex flex-col justify-between border border-white/5">
                    <div className="flex justify-between items-start">
                        <div className="bg-green-500/20 text-green-400 p-2 rounded-xl">
                            <Activity size={20} />
                        </div>
                        <span className="text-2xl font-bold text-white">1/3</span>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs mt-2">Allenamenti</p>
                        <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-green-500 h-full w-1/3"></div>
                        </div>
                    </div>
                </div>

                {/* Calories / Streak */}
                <div className="bg-[#1c1c1e] rounded-[2rem] p-5 flex flex-col justify-between border border-white/5">
                    <div className="flex justify-between items-start">
                        <div className="bg-orange-500/20 text-orange-400 p-2 rounded-xl">
                            <Flame size={20} />
                        </div>
                        <span className="text-2xl font-bold text-white">12</span>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs mt-2">Giorni Streak</p>
                        <p className="text-[10px] text-gray-500">Continua così! 🔥</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
