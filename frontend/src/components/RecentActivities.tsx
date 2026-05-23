import { useDashboard } from "../context/DashboardContext";

export default function RecentActivity() {
  const { activities } = useDashboard();

  return (
    <div className="bg-white rounded-3xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          Recent Activity
        </h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="border-b pb-4"
          >
            <p className="font-medium">
              {activity.title}
            </p>

            <p className="text-sm text-slate-500">
              {activity.description}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              {new Date(
                activity.timestamp
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}