import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Info,
  AlertTriangle,
  CheckSquare,
  ChevronRight,
  Clock
} from "lucide-react";
import { NotificationItem } from "../App";

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigate: (page: string) => void;
  setActiveEntryId: (id: string | null) => void;
}

export default function NotificationsPage({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigate,
  setActiveEntryId,
}: NotificationsPageProps): React.ReactElement {
  const [filter, setFilter] = useState<"all" | "unread" | "info" | "success" | "warning">("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "info") return n.type === "info";
    if (filter === "success") return n.type === "success";
    if (filter === "warning") return n.type === "warning";
    return true;
  });

  const handleAction = (notif: NotificationItem) => {
    onMarkAsRead(notif.id);
    if (notif.entryId) {
      setActiveEntryId(notif.entryId);
    }
    if (notif.actionRoute) {
      onNavigate(notif.actionRoute);
    }
  };

  return (
    <div className="flex-grow bg-kms-gray-bg w-full py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-[5px] border border-gray-200/50 shadow-sm">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-12 h-12 bg-kms-green-dark/5 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-kms-green-dark" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Notifikasi</h1>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                Anda memiliki {unreadCount} notifikasi yang belum dibaca
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="inline-flex items-center justify-center bg-kms-green-dark hover:bg-emerald-950 active:scale-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-[5px] transition-all cursor-pointer border-none shadow-xs"
            >
              <CheckSquare className="w-4 h-4 mr-2" /> Tandai Semua Dibaca
            </button>
          )}
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1 select-none">
          {[
            { id: "all", label: "Semua" },
            { id: "unread", label: "Belum Dibaca" },
            { id: "info", label: "Pengajuan" },
            { id: "success", label: "Disetujui" },
            { id: "warning", label: "Revisi & Ditolak" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 text-xs font-extrabold rounded-[5px] transition-all cursor-pointer border-none ${
                filter === tab.id
                  ? "bg-kms-green-dark text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-[5px] border border-gray-200/50 shadow-sm overflow-hidden">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && onMarkAsRead(notif.id)}
                  className={`p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-kms-green-light/5 transition-all duration-200 cursor-pointer ${
                    !notif.isRead ? "bg-[#eaf4e8]/40 border-l-4 border-l-kms-green-dark" : "border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex items-start space-x-4 text-left flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-1">
                      {notif.type === "success" && (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-kms-green-status" />
                        </div>
                      )}
                      {notif.type === "warning" && (
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shadow-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        </div>
                      )}
                      {notif.type === "info" && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shadow-xs">
                          <Info className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-extrabold leading-tight ${!notif.isRead ? "text-gray-900" : "text-gray-700"}`}>
                          {notif.title}
                        </span>
                        {!notif.isRead && (
                          <span className="bg-kms-green-dark text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider select-none">
                            Baru
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed font-normal">
                        {notif.message}
                      </p>
                      
                      <div className="flex items-center text-[10px] text-gray-400 font-semibold mt-3 select-none">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {notif.time}
                      </div>
                    </div>
                  </div>

                  {notif.actionRoute && (
                    <div className="flex-shrink-0 self-end sm:self-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(notif);
                        }}
                        className="inline-flex items-center bg-kms-green-dark hover:bg-emerald-950 active:scale-95 text-white text-xs font-extrabold px-4 py-2 rounded-[5px] transition-all cursor-pointer border-none shadow-xs"
                      >
                        Tindak Lanjuti <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center flex flex-col items-center justify-center select-none">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
                <Bell className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-800">Tidak Ada Notifikasi</h3>
              <p className="text-xs text-gray-400 max-w-xs mt-1.5 leading-normal">
                Belum ada pemberitahuan baru yang sesuai dengan filter yang Anda pilih.
              </p>
            </div>
          )}
        </div>

        {/* Navigation back button */}
        <div className="text-left select-none">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-xs font-extrabold text-kms-green-dark hover:text-emerald-900 flex items-center transition cursor-pointer border-none bg-transparent"
          >
            ← Kembali ke Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
