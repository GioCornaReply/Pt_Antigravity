'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Camera, Maximize2, Minimize2, X } from 'lucide-react';

export default function ChatInterface({ isExpanded, toggleExpand }: { isExpanded: boolean, toggleExpand: () => void }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: 'Ciao! Oggi è Lunedì, tocca alle Gambe. Come ti senti oggi?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = 'it-IT';

                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(prev => prev + (prev ? ' ' : '') + transcript);
                    setIsListening(false);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Il tuo browser non supporta il riconoscimento vocale.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', content: "Errore di connessione al server." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`bg-card flex flex-col shadow-[0_-4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 border-t border-white/10 ${isExpanded ? 'h-full w-full rounded-none' : 'h-full rounded-t-3xl'}`}>
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-card/95 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
                        <div className={`absolute inset-0 w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'} animate-ping opacity-75`}></div>
                    </div>
                    <div>
                        <span className="font-bold text-white block leading-none">AI Coach</span>
                        <span className="text-[10px] text-accent uppercase tracking-widest">{isLoading ? 'Sta scrivendo...' : 'Online'}</span>
                    </div>
                </div>
                <button onClick={toggleExpand} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                    {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-background/30">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl max-w-[85%] text-sm shadow-sm ${msg.role === 'user'
                            ? 'bg-accent text-background rounded-tr-none font-semibold'
                            : 'bg-card border border-white/5 text-gray-200 rounded-tl-none'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-card border-t border-white/5 pb-6">
                <div className="flex gap-2 items-end">
                    <button className="p-3 text-gray-400 hover:text-accent hover:bg-white/5 rounded-xl transition-colors mb-1">
                        <Camera size={22} />
                    </button>
                    <div className="flex-1 relative bg-background/50 rounded-2xl border border-white/10 focus-within:border-accent/50 transition-colors">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                            placeholder={isListening ? "Sto ascoltando..." : "Scrivi al coach..."}
                            className="w-full bg-transparent py-3 px-4 text-white focus:outline-none resize-none max-h-24 min-h-[50px]"
                            rows={1}
                        />
                        <button
                            onClick={toggleListening}
                            className={`absolute right-2 bottom-2 p-1 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Mic size={20} />
                        </button>
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={isLoading}
                        className="bg-accent text-background p-3 rounded-xl font-bold hover:bg-accent/80 transition-colors shadow-[0_0_15px_rgba(41,203,232,0.4)] mb-1 disabled:opacity-50"
                    >
                        <Send size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
}
