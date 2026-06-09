import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCircle2,
  Info,
  X,
  Calendar,
  ArrowRight,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "info" | "success";
  actionRoute?: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Data Benih Baru",
    message:
      "Data Varietas Padi Lokal baru saja ditambahkan oleh Budi Santoso dan menunggu validasi Anda. Silakan review data tersebut beserta dokumen lampirannya.",
    time: "5 menit lalu",
    isRead: false,
    type: "info",
    actionRoute: "validasi-data",
  },
  {
    id: "2",
    title: "Validasi Berhasil",
    message:
      "Data Pengetahuan Adat 'Sistem Subak' telah berhasil divalidasi dan dipublikasi ke publik. Tidak ada tindakan lebih lanjut yang diperlukan.",
    time: "1 jam lalu",
    isRead: false,
    type: "success",
  },
  {
    id: "3",
    title: "Pembaruan Sistem",
    message:
      "Pemeliharaan server berkala dijadwalkan besok pada pukul 00:00 - 02:00 WIB. Sistem mungkin akan mengalami downtime ringan.",
    time: "1 hari lalu",
    isRead: true,
    type: "info",
  },
];

interface NotificationMenuProps {
  onNavigate?: (page: string) => void;
}

export default function NotificationMenu({
  onNavigate,
}: NotificationMenuProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotifClick = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
    );
    setSelectedNotif(notif);
    setIsOpen(false);
  };

  const handleActionClick = () => {
    if (selectedNotif?.actionRoute && onNavigate) {
      onNavigate(selectedNotif.actionRoute);
    }
    setSelectedNotif(null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer border-none bg-transparent flex items-center justify-center"
        aria-label="Notifikasi"
      >
        <Bell className="w-4 h-4 text-gray-200" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-kms-green-status rounded-full shadow-sm"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-gray-800">Notifikasi</h3>
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
            {notifications.length > 0 ? (
              <ul className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    onClick={() => handleNotifClick(notif)}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                      !notif.isRead ? "bg-[#eaf4e8]" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {notif.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-kms-green-status" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${
                          !notif.isRead ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-snug">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1.5 font-medium flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {notif.time}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="flex-shrink-0">
                        <span className="w-2.5 h-2.5 bg-kms-green-status rounded-full inline-block shadow-sm"></span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Belum ada notifikasi baru
                </p>
              </div>
            )}
          </div>
          <div className="p-2 border-t border-gray-100 bg-gray-50/50">
            <button className="w-full py-2 text-xs text-center font-bold text-gray-600 hover:text-kms-green-dark border-none bg-transparent cursor-pointer transition-colors rounded hover:bg-gray-100">
              Lihat Semua Notifikasi
            </button>
          </div>
        </div>
      )}

      {/* Modal Detail Notifikasi */}
      {selectedNotif && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-transform">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center space-x-2">
                {selectedNotif.type === "success" ? (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-kms-green-status" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Info className="w-4 h-4 text-blue-500" />
                  </div>
                )}
                <h3 className="text-sm font-bold text-gray-800">
                  Detail Notifikasi
                </h3>
              </div>
              <button
                onClick={() => setSelectedNotif(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                {selectedNotif.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {selectedNotif.message}
              </p>
              <div className="flex items-center text-xs text-gray-400 font-medium mb-6">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {selectedNotif.time}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedNotif(null)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors border-none cursor-pointer bg-transparent"
                >
                  Tutup
                </button>
                {selectedNotif.actionRoute && (
                  <button
                    onClick={handleActionClick}
                    className="px-4 py-2 text-sm font-semibold text-white bg-kms-green-dark hover:bg-[#1E301D] rounded-md transition-all shadow-sm flex items-center cursor-pointer border-none"
                  >
                    Tindak Lanjuti <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
