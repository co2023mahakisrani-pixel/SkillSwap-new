import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, Phone, Monitor, MessageSquare, Settings, Clock, ArrowLeft, Maximize, Minimize, X, Users } from 'lucide-react';

const LiveClass = ({ user }) => {
    const { id } = useParams();
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, user: 'Suraj', message: 'Hi! Ready to start?', time: '2:00 PM' },
        { id: 2, user: 'You', message: 'Yes! Let\'s begin.', time: '2:01 PM' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isJoining, setIsJoining] = useState(true);

    if (!user) return <Navigate to="/auth" />;

    useEffect(() => {
        const timer = setTimeout(() => setIsJoining(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setChatMessages(prev => [...prev, { id: prev.length + 1, user: 'You', message: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setNewMessage('');
    };

    const sessionInfo = { topic: 'Learning Session', partner: 'Partner', startTime: 'Now', duration: '60 min' };

    if (isJoining) return <div className="min-h-[80vh] flex flex-col items-center justify-center"><div className="w-20 h-20 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-6"></div><h2 className="text-2xl font-bold mb-2">Joining Session...</h2></div>;

    return (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
                    <div>
                        <h1 className="text-white font-bold">{sessionInfo.topic}</h1>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{sessionInfo.partner}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{sessionInfo.duration}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={toggleFullscreen} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">{isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}</button>
                    <Link to="/dashboard" className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><X className="w-5 h-5" /></Link>
                </div>
            </div>

            <div className="flex-1 flex">
                <div className="flex-1 relative">
                    <div className="absolute inset-4 bg-slate-800 rounded-2xl overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-4xl font-bold text-slate-400">P</span></div>
                                <p className="text-slate-400">{sessionInfo.partner}</p>
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-2"><span className="px-3 py-1 bg-black/50 text-white text-sm rounded-full flex items-center gap-1"><Mic className="w-3 h-3" /></span></div>
                    </div>
                    <div className="absolute bottom-20 right-4 w-48 h-36 bg-slate-700 rounded-xl overflow-hidden border-2 border-slate-600">
                        {isVideoOn ? <div className="w-full h-full flex items-center justify-center"><div className="text-center"><div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mx-auto"><span className="text-xl font-bold text-slate-300">Y</span></div></div></div> : <div className="w-full h-full flex items-center justify-center bg-slate-800"><VideoOff className="w-8 h-8 text-slate-500" /></div>}
                        <div className="absolute bottom-2 left-2 flex items-center gap-1"><span className="px-2 py-0.5 bg-black/50 text-white text-xs rounded flex items-center gap-1">{isMicOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3 text-red-500" />}You</span></div>
                    </div>
                </div>

                {showChat && (
                    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
                        <div className="p-4 border-b border-slate-800"><h3 className="font-bold text-white flex items-center gap-2"><MessageSquare className="w-4 h-4" />Chat</h3></div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatMessages.map((msg) => {
                              const isYou = msg.user === 'You';
                              return (
                                <div key={msg.id} className={isYou ? 'text-right' : ''}>
                                  <div className={`inline-block max-w-[80%] p-3 rounded-xl ${isYou ? 'bg-primary-600 text-white' : 'bg-slate-800 text-white'}`}>
                                    {!isYou && <p className="text-xs text-primary-400 font-semibold mb-1">{msg.user}</p>}
                                    <p>{msg.message}</p>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1">{msg.time}</p>
                                </div>
                              );
                            })}
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800"><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500" /></form>
                    </div>
                )}
            </div>

            <div className="bg-slate-900 px-6 py-4">
                <div className="flex items-center justify-center gap-4">
                    <button onClick={() => setIsMicOn(!isMicOn)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isMicOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-600 text-white hover:bg-red-700'}`}>{isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}</button>
                    <button onClick={() => setIsVideoOn(!isVideoOn)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isVideoOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-600 text-white hover:bg-red-700'}`}>{isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}</button>
                    <button onClick={() => setIsScreenSharing(!isScreenSharing)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isScreenSharing ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-slate-700 text-white hover:bg-slate-600'}`}><Monitor className="w-6 h-6" /></button>
                    <button onClick={() => setShowChat(!showChat)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${showChat ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-slate-700 text-white hover:bg-slate-600'}`}><MessageSquare className="w-6 h-6" /></button>
                    <button className="w-14 h-14 rounded-full bg-slate-700 text-white hover:bg-slate-600 flex items-center justify-center transition-colors"><Settings className="w-6 h-6" /></button>
                    <Link to="/dashboard" className="w-14 h-14 rounded-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center transition-colors ml-4"><Phone className="w-6 h-6" /></Link>
                </div>
            </div>
        </div>
    );
};

export default LiveClass;
