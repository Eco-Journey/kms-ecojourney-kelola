import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  MessageSquare,
  X,
  Reply,
  Send,
  CheckCircle2,
} from "lucide-react";

interface MessageItem {
  id: string;
  senderName: string;
  avatarLetter: string;
  message: string;
  time: string;
  isRead: boolean;
}

const MOCK_MESSAGES: MessageItem[] = [
  {
    id: "1",
    senderName: "Budi Santoso",
    avatarLetter: "B",
    message:
      "Halo Bapak/Ibu, tolong review data benih padi ketan yang baru saya submit kemarin karena ada perbaikan sedikit di bagian deskripsi. Terima kasih.",
    time: "10 menit lalu",
    isRead: false,
  },
  {
    id: "2",
    senderName: "Siti Aminah",
    avatarLetter: "S",
    message:
      "Terima kasih atas persetujuannya, saya akan menambahkan data pengetahuan adat lainnya minggu depan setelah wawancara selesai.",
    time: "2 jam lalu",
    isRead: true,
  },
];

export default function MessageMenu(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(
    null,
  );

  // Reply State
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSent, setIsSent] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset reply state if modal closes
  useEffect(() => {
    if (!selectedMessage) {
      setIsReplying(false);
      setReplyText("");
      setIsSent(false);
    }
  }, [selectedMessage]);

  const markAllAsRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
  };

  const handleMessageClick = (msg: MessageItem) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)),
    );
    setSelectedMessage(msg);
    setIsOpen(false);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    // Simulate sending message (In real app, this sends to Supabase)
    setIsSent(true);
    setTimeout(() => {
      setSelectedMessage(null);
    }, 1500); // Wait 1.5s to show success feedback before closing modal
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer border-none bg-transparent flex items-center justify-center"
        aria-label="Pesan"
      >
        <Mail className="w-4 h-4 text-gray-200" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-kms-red rounded-full shadow-sm"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-[8px] shadow-xl border border-gray-200/60 z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-gray-800">Pesan Masuk</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-kms-green-dark hover:text-kms-green-status font-semibold cursor-pointer border-none bg-transparent transition-colors"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {messages.length > 0 ? (
              <ul className="divide-y divide-gray-50">
                {messages.map((msg) => (
                  <li
                    key={msg.id}
                    onClick={() => handleMessageClick(msg)}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                      !msg.isRead ? "bg-[#fbeaea]" : ""
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-kms-green-light to-kms-green-dark flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {msg.avatarLetter}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <p
                          className={`text-sm font-semibold truncate ${
                            !msg.isRead ? "text-gray-900" : "text-gray-700"
                          }`}
                        >
                          {msg.senderName}
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                    {!msg.isRead && (
                      <div className="flex-shrink-0 mt-1.5 border-none">
                        <span className="w-2.5 h-2.5 bg-kms-red rounded-full inline-block shadow-sm"></span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <MessageSquare className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Belum ada pesan baru
                </p>
              </div>
            )}
          </div>
          <div className="p-2 border-t border-gray-100 bg-gray-50/50">
            <button className="w-full py-2 text-xs text-center font-bold text-gray-600 hover:text-kms-green-dark border-none bg-transparent cursor-pointer transition-colors rounded hover:bg-gray-100">
              Buka Kotak Masuk
            </button>
          </div>
        </div>
      )}

      {/* Modal Detail Pesan */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-transform">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-kms-green-light to-kms-green-dark flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {selectedMessage.avatarLetter}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 leading-none mb-1">
                    {selectedMessage.senderName}
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    {selectedMessage.time}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-5">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedMessage.message}
                </p>
              </div>

              {isSent ? (
                <div className="flex flex-col items-center justify-center py-6 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="w-10 h-10 text-kms-green-status mb-3" />
                  <p className="text-sm font-bold text-gray-800">
                    Pesan Terkirim!
                  </p>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Balasan Anda berhasil dikirimkan ke{" "}
                    {selectedMessage.senderName}.
                  </p>
                </div>
              ) : isReplying ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <label
                    htmlFor="replyArea"
                    className="block text-xs font-bold text-gray-700 mb-2"
                  >
                    Balasan Anda:
                  </label>
                  <textarea
                    id="replyArea"
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Ketik balasan di sini..."
                    className="w-full text-sm p-3 text-gray-800 bg-white placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kms-green-light focus:border-transparent transition-all resize-none shadow-sm"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => {
                        setIsReplying(false);
                        setReplyText("");
                      }}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors border-none cursor-pointer bg-transparent"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className={`px-4 py-2 text-xs font-bold text-white rounded-md transition-all shadow-sm flex items-center cursor-pointer border-none ${
                        replyText.trim()
                          ? "bg-kms-green-dark hover:bg-[#1E301D]"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5 mr-2" /> Kirim
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors border-none cursor-pointer bg-transparent"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => setIsReplying(true)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-kms-green-dark hover:bg-[#1E301D] rounded-md transition-all shadow-sm flex items-center cursor-pointer border-none"
                  >
                    <Reply className="w-4 h-4 mr-2" /> Balas Pesan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
