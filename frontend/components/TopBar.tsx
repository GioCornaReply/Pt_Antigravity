'use client';

import { User } from 'lucide-react';

interface TopBarProps {
    userImage?: string;
    onProfileClick: () => void;
}

export default function TopBar({ userImage, onProfileClick }: TopBarProps) {
    return (
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-40 bg-gradient-to-b from-black/80 to-transparent">
            <h1 className="text-xl font-bold text-white">PT Gym</h1>
            <button
                onClick={onProfileClick}
                className="w-10 h-10 rounded-full bg-card border border-white/10 overflow-hidden flex items-center justify-center hover:border-accent transition-colors"
            >
                {userImage ? (
                    <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <User size={20} className="text-gray-400" />
                )}
            </button>
        </div>
    );
}
