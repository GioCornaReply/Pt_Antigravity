'use client';

import { useState, useEffect } from 'react';
import HomeView from '@/components/HomeView';
import WorkoutView from '@/components/WorkoutView';
import NutritionView from '@/components/NutritionView';
import ProfileView from '@/components/ProfileView';
import ChatInterface from '@/components/ChatInterface';
import BottomNav from '@/components/BottomNav';
import { MessageSquare } from 'lucide-react';

export type ViewState = 'home' | 'workout' | 'nutrition' | 'profile';

export default function Home() {
  const [view, setView] = useState<ViewState>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/user');
        if (res.ok) {
          const user = await res.json();
          if (user) {
            setUserName(user.name);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

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

  return (
    <main className="fixed inset-0 w-full h-full bg-background flex flex-col overflow-hidden">

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden p-3 sm:p-4 relative">
        {view === 'home' && <HomeView userName={userName} onSelectDate={handleDateSelect} />}
        {view === 'workout' && <WorkoutView date={selectedDate} />}
        {view === 'nutrition' && <NutritionView date={selectedDate} />}
        {view === 'profile' && <ProfileView />}
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
      <div className={`fixed inset-x-0 bottom-0 transition-all duration-300 z-50 ${isChatOpen ? 'h-[80%] sm:h-[600px] sm:w-[400px] sm:right-4 sm:left-auto sm:rounded-t-3xl' : 'h-0 overflow-hidden'}`}>
        <ChatInterface isExpanded={true} toggleExpand={() => setIsChatOpen(false)} />
      </div>
    </main>
  );
}

