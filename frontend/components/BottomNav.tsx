'use client';

import { Home, Dumbbell, Utensils } from 'lucide-react';

type Tab = 'home' | 'workout' | 'nutrition' | 'profile';

interface BottomNavProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
    return (
        <div className="bg-card border-t border-white/10 p-2 flex justify-around items-center pb-6">
            <button
                onClick={() => setActiveTab('home')}
                className={`p-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-accent text-background shadow-[0_0_15px_rgba(41,203,232,0.4)]' : 'text-gray-400 hover:text-white'}`}
            >
                <Home size={24} />
                <span className="sr-only">Home</span>
            </button>

            <button
                onClick={() => setActiveTab('workout')}
                className={`p-3 rounded-xl transition-all ${activeTab === 'workout' ? 'bg-accent text-background shadow-[0_0_15px_rgba(41,203,232,0.4)]' : 'text-gray-400 hover:text-white'}`}
            >
                <Dumbbell size={24} />
                <span className="sr-only">Scheda</span>
            </button>

            <button
                onClick={() => setActiveTab('nutrition')}
                className={`p-3 rounded-xl transition-all ${activeTab === 'nutrition' ? 'bg-accent text-background shadow-[0_0_15px_rgba(41,203,232,0.4)]' : 'text-gray-400 hover:text-white'}`}
            >
                <Utensils size={24} />
                <span className="sr-only">Nutrizione</span>
            </button>

            {/* Placeholder Slot */}
            <div className="p-3 w-[48px] h-[48px] flex items-center justify-center rounded-xl border border-white/5 bg-white/5">
                <span className="text-[10px] text-gray-600 text-center leading-tight">Space Empty</span>
            </div>
        </div>
    );
}
