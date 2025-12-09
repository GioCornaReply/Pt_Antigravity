'use client';

import { useState, useEffect } from 'react';
import AuthView from '@/components/AuthView';
import HomeView from '@/components/HomeView';
import WorkoutView from '@/components/WorkoutView';
import NutritionView from '@/components/NutritionView';
import ProfileView from '@/components/ProfileView';
import ChatInterface from '@/components/ChatInterface';
import BottomNav from '@/components/BottomNav';
import TopBar from '@/components/TopBar';
import { MessageSquare } from 'lucide-react';

import MuscleCalendar from '@/components/MuscleCalendar';

export type ViewState = 'home' | 'workout' | 'nutrition' | 'profile' | 'calendar';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<ViewState>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Check for session/user on mount (mock persistence for now or rely on AuthView)
  useEffect(() => {
    // Ideally check session API here. For now, we start at AuthView.
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setView('home');
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setView('workout');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Mobile Frame Wrapper
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1a1a] p-0 sm:p-8">
      <div className="mobile-frame relative w-full h-full bg-background flex flex-col overflow-hidden">

        {!user ? (
          <AuthView onLogin={handleLogin} />
        ) : (
          <>
            {/* Top Bar */}
            <TopBar userImage={user.image_url} onProfileClick={() => setView('profile')} />

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden p-3 sm:p-4 relative pt-16">
              {view === 'home' && <HomeView userName={user.name} onSelectDate={handleDateSelect} />}
              {view === 'workout' && <WorkoutView date={selectedDate} />}
              {view === 'nutrition' && <NutritionView date={selectedDate} />}
              {view === 'calendar' && <MuscleCalendar onSelectDate={handleDateSelect} />}
              {view === 'profile' && <ProfileView user={user} onUpdate={setUser} />}
            </div>

            {/* Bottom Navigation */}
            <BottomNav activeTab={view} setActiveTab={(tab) => setView(tab as ViewState)} />

            {/* Global Chat Popup */}
            {/* Chat Button (Floating) */}
            {!isChatOpen && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-24 right-4 bg-accent text-background p-4 rounded-full shadow-[0_0_20px_rgba(41,203,232,0.6)] hover:scale-110 transition-transform z-50"
              >
                <MessageSquare size={28} />
              </button>
            )}

            {/* Chat Interface Overlay */}
            <div className={`fixed inset-x-0 bottom-0 transition-all duration-300 z-50 ${isChatOpen ? 'h-[80%] rounded-t-3xl' : 'h-0 overflow-hidden'}`}>
              <ChatInterface isExpanded={true} toggleExpand={() => setIsChatOpen(false)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
