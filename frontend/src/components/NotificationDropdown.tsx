import { Bell } from "lucide-react";
import { useState } from "react";
import { useDashboard } from "../context/DashboardContext";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  const {
    notifications,
    markNotificationRead,
  } = useDashboard();

  const unreadCount =
    notifications.filter((n) => !n.read)
      .length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl bg-white shadow"
      >
        <Bell />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-2xl shadow-xl z-50">
          <div className="p-4 border-b font-semibold">
            Notifications
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-slate-400">
                No notifications
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() =>
                    markNotificationRead(
                      n.id
                    )
                  }
                  className="w-full text-left p-4 border-b hover:bg-slate-50"
                >
                  <p className="font-medium text-sm">
                    {n.title}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {n.message}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}