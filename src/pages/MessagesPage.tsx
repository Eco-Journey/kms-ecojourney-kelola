import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  MessageSquare,
  Send,
  ChevronLeft
} from "lucide-react";
import { MessageThread } from "../App";

interface MessagesPageProps {
  messages: MessageThread[];
  onSendMessageReply: (threadId: string, text: string) => void;
  onNavigate: (page: string) => void;
}

export default function MessagesPage({
  messages,
  onSendMessageReply,
  onNavigate,
}: MessagesPageProps): React.ReactElement {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = messages.find((t) => t.id === selectedThreadId);

  // Auto-scroll chat history to the bottom on thread load/updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedThreadId) return;

    onSendMessageReply(selectedThreadId, replyText);
    setReplyText("");
  };

  return (
    <div className="flex-grow bg-kms-gray-bg w-full py-8 px-4 md:px-8 flex flex-col h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col md:flex-row bg-white rounded-[5px] border border-gray-200/50 shadow-sm overflow-hidden h-full">
        
        {/* Left Side: Threads List */}
        <div className={`w-full md:w-80 flex-shrink-0 border-r border-gray-200 flex flex-col bg-white ${
          selectedThreadId ? "hidden md:flex" : "flex"
        }`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center space-x-2.5 text-left">
              <Mail className="w-5 h-5 text-kms-green-dark" />
              <span className="font-extrabold text-sm text-gray-800">Utas Diskusi</span>
            </div>
            <span className="bg-kms-red/15 text-kms-red text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              {messages.filter(m => !m.isRead).length} Belum Dibaca
            </span>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {messages.length > 0 ? (
              messages.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`p-4 hover:bg-kms-green-light/5 transition-all cursor-pointer text-left flex items-start space-x-3 border-l-4 ${
                    selectedThreadId === thread.id
                      ? "bg-kms-green-light/10 border-l-kms-green-dark"
                      : !thread.isRead
                      ? "bg-[#eaf4e8]/20 border-l-kms-red/40"
                      : "border-l-transparent"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-kms-green-light to-kms-green-dark flex items-center justify-center text-white text-xs font-extrabold shadow-xs">
                      {thread.avatarLetter}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className={`text-xs font-extrabold truncate ${!thread.isRead ? "text-gray-900" : "text-gray-700"}`}>
                        {thread.senderName}
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold whitespace-nowrap ml-2">
                        {thread.time}
                      </span>
                    </div>
                    <p className={`text-xs font-bold truncate ${!thread.isRead ? "text-gray-900" : "text-gray-600"}`}>
                      {thread.subject}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 truncate font-normal">
                      {thread.messages[thread.messages.length - 1]?.text}
                    </p>
                  </div>
                  {!thread.isRead && (
                    <div className="flex-shrink-0 self-center">
                      <span className="w-2 h-2 bg-kms-red rounded-full block shadow-xs animate-pulse"></span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center select-none mt-16">
                <MessageSquare className="w-10 h-10 text-gray-200 mb-3" />
                <h3 className="text-xs font-extrabold text-gray-600">Tidak ada pesan</h3>
                <p className="text-[10px] text-gray-400 max-w-xs mt-1 font-normal">
                  Utas diskusi akan dibuat otomatis ketika ada data yang dikembalikan untuk revisi.
                </p>
              </div>
            )}
          </div>
          
          {/* Footer Back Link */}
          <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-left">
            <button
              onClick={() => onNavigate("dashboard")}
              className="text-[10px] font-extrabold text-kms-green-dark hover:text-emerald-950 flex items-center transition border-none bg-transparent cursor-pointer"
            >
              ← Kembali ke Dashboard
            </button>
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className={`flex-1 flex flex-col bg-[#F9FAFB] ${
          !selectedThreadId ? "hidden md:flex" : "flex"
        }`}>
          {activeThread ? (
            <>
              {/* Active Header */}
              <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-left">
                  {/* Back button on mobile */}
                  <button
                    onClick={() => setSelectedThreadId(null)}
                    className="md:hidden p-1 rounded hover:bg-gray-100 mr-1 cursor-pointer border-none bg-transparent"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-kms-green-light to-kms-green-dark flex items-center justify-center text-white text-xs font-extrabold shadow-xs">
                    {activeThread.avatarLetter}
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-900 leading-none">{activeThread.senderName}</h3>
                    <p className="text-[10px] text-gray-400 font-extrabold mt-1 uppercase tracking-wider">{activeThread.subject}</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {activeThread.messages.map((msg, index) => {
                  const isMe = msg.sender === "Anda";
                  return (
                    <div
                      key={index}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] rounded-[8px] p-3 shadow-xs text-left ${
                        isMe
                          ? "bg-kms-green-dark text-white rounded-tr-none"
                          : "bg-white border border-gray-200/50 text-gray-800 rounded-tl-none"
                      }`}>
                        <div className="text-[9px] font-extrabold uppercase tracking-wider mb-1 opacity-70">
                          {msg.sender}
                        </div>
                        <p className="text-xs font-normal leading-relaxed whitespace-pre-line">
                          {msg.text}
                        </p>
                        <div className="text-[8px] font-semibold text-right mt-1.5 opacity-60">
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Ketik balasan Anda disini..."
                  className="flex-grow text-xs p-3 border border-gray-200 rounded-[5px] outline-none focus:border-kms-green-light transition-all bg-gray-50/50"
                  required
                />
                
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className={`p-3 rounded-[5px] transition-all flex items-center justify-center cursor-pointer border-none shadow-xs text-white ${
                    replyText.trim()
                      ? "bg-kms-green-dark hover:bg-emerald-950 active:scale-95"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  title="Kirim Balasan"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-8 select-none text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 border border-gray-200/40 shadow-inner">
                <MessageSquare className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-700">Pesan Masuk</h3>
              <p className="text-xs text-gray-400 max-w-xs mt-1.5 leading-normal font-normal">
                Pilih salah satu percakapan di kolom sebelah kiri untuk mulai membaca dan membalas pesan kearifan lokal.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
