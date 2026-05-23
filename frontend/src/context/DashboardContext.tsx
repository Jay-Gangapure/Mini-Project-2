import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { useAuth } from "./AuthContext";

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: "chat" | "document" | "rights" | "scheme";
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface DashboardContextType {
  uploadedDocuments: number;
  issuesResolved: number;
  schemesFound: number;

  activities: ActivityItem[];
  notifications: NotificationItem[];

  addActivity: (
    activity: Omit<ActivityItem, "id" | "timestamp">
  ) => void;

  addNotification: (
    notification: Omit<
      NotificationItem,
      "id" | "created_at" | "read"
    >
  ) => void;

  markNotificationRead: (
    id: string
  ) => void;

  incrementDocuments: () => void;

  incrementIssuesResolved: () => void;

  incrementSchemesFound: () => void;

  resetDashboard: () => void;
  deleteActivities: (ids: string[]) => void;
}

const DashboardContext =
  createContext<DashboardContextType>(
    {} as DashboardContextType
  );

export const DashboardProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const { user } = useAuth();

  // =====================================
  // UNIQUE USER STORAGE KEY
  // =====================================

  const userKey =
    user?.email || "guest";

  // =====================================
  // COUNTERS
  // =====================================

  const [
    uploadedDocuments,
    setUploadedDocuments,
  ] = useState(0);

  const [
    issuesResolved,
    setIssuesResolved,
  ] = useState(0);

  const [
    schemesFound,
    setSchemesFound,
  ] = useState(0);

  // =====================================
  // ARRAYS
  // =====================================

  const [activities, setActivities] =
    useState<ActivityItem[]>([]);

  const [
    notifications,
    setNotifications,
  ] = useState<NotificationItem[]>([]);

  // =====================================
  // STORAGE KEYS
  // =====================================

  const KEYS = {
    activities: `activities_${userKey}`,
    notifications: `notifications_${userKey}`,
    documents: `documents_${userKey}`,
    resolved: `resolved_${userKey}`,
    schemes: `schemes_${userKey}`,
  };

  // =====================================
  // LOAD USER DATA
  // =====================================

  useEffect(() => {

    const savedActivities =
      localStorage.getItem(
        KEYS.activities
      );

    const savedNotifications =
      localStorage.getItem(
        KEYS.notifications
      );

    const savedDocuments =
      localStorage.getItem(
        KEYS.documents
      );

    const savedResolved =
      localStorage.getItem(
        KEYS.resolved
      );

    const savedSchemes =
      localStorage.getItem(
        KEYS.schemes
      );

    setActivities(
      savedActivities
        ? JSON.parse(savedActivities)
        : []
    );

    setNotifications(
      savedNotifications
        ? JSON.parse(savedNotifications)
        : []
    );

    setUploadedDocuments(
      savedDocuments
        ? Number(savedDocuments)
        : 0
    );

    setIssuesResolved(
      savedResolved
        ? Number(savedResolved)
        : 0
    );

    setSchemesFound(
      savedSchemes
        ? Number(savedSchemes)
        : 0
    );

  }, [userKey]);

  // =====================================
  // SAVE ACTIVITIES
  // =====================================

  useEffect(() => {

    localStorage.setItem(
      KEYS.activities,
      JSON.stringify(activities)
    );

  }, [activities, userKey]);

  // =====================================
  // SAVE NOTIFICATIONS
  // =====================================

  useEffect(() => {

    localStorage.setItem(
      KEYS.notifications,
      JSON.stringify(notifications)
    );

  }, [notifications, userKey]);

  // =====================================
  // SAVE DOCUMENTS
  // =====================================

  useEffect(() => {

    localStorage.setItem(
      KEYS.documents,
      uploadedDocuments.toString()
    );

  }, [uploadedDocuments, userKey]);

  // =====================================
  // SAVE ISSUES
  // =====================================

  useEffect(() => {

    localStorage.setItem(
      KEYS.resolved,
      issuesResolved.toString()
    );

  }, [issuesResolved, userKey]);

  // =====================================
  // SAVE SCHEMES
  // =====================================

  useEffect(() => {

    localStorage.setItem(
      KEYS.schemes,
      schemesFound.toString()
    );

  }, [schemesFound, userKey]);

  // =====================================
  // COUNTER FUNCTIONS
  // =====================================

  const incrementDocuments = () => {
    setUploadedDocuments(
      (prev) => prev + 1
    );
  };

  const incrementIssuesResolved = () => {
    setIssuesResolved(
      (prev) => prev + 1
    );
  };

  const incrementSchemesFound = () => {
    setSchemesFound(
      (prev) => prev + 1
    );
  };

  // =====================================
  // ADD ACTIVITY
  // =====================================

  const addActivity = (
    activity: Omit<
      ActivityItem,
      "id" | "timestamp"
    >
  ) => {

    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    setActivities((prev) => [
      newActivity,
      ...prev,
    ]);

    // AUTO UPDATE COUNTS

    if (activity.type === "document") {
      incrementDocuments();
    }

    if (activity.type === "rights") {
      incrementIssuesResolved();
    }

    if (activity.type === "scheme") {
      incrementSchemesFound();
    }
  };

  // =====================================
  // ADD NOTIFICATION
  // =====================================

  const addNotification = (
    notification: Omit<
      NotificationItem,
      "id" | "created_at" | "read"
    >
  ) => {

    const newNotification: NotificationItem =
      {
        ...notification,
        id: Date.now().toString(),
        created_at:
          new Date().toISOString(),
        read: false,
      };

    setNotifications((prev) => [
      newNotification,
      ...prev,
    ]);
  };

  // =====================================
  // READ NOTIFICATION
  // =====================================

  const markNotificationRead = (
    id: string
  ) => {

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  // =====================================
  // RESET DASHBOARD
  // =====================================

  const resetDashboard = () => {

    setUploadedDocuments(0);

    setIssuesResolved(0);

    setSchemesFound(0);

    setActivities([]);

    setNotifications([]);

    localStorage.removeItem(
      KEYS.documents
    );

    localStorage.removeItem(
      KEYS.resolved
    );

    localStorage.removeItem(
      KEYS.schemes
    );

    localStorage.removeItem(
      KEYS.activities
    );

    localStorage.removeItem(
      KEYS.notifications
    );
  };

  const deleteActivities = (
  ids: string[]
) => {

  const activitiesToDelete =
    activities.filter((activity) =>
      ids.includes(activity.id)
    );

  // UPDATE COUNTS

  let documentsToRemove = 0;
  let issuesToRemove = 0;
  let schemesToRemove = 0;

  activitiesToDelete.forEach(
    (activity) => {

      if (activity.type === "document") {
        documentsToRemove++;
      }

      if (activity.type === "rights") {
        issuesToRemove++;
      }

      if (activity.type === "scheme") {
        schemesToRemove++;
      }

    }
  );

  setUploadedDocuments((prev) =>
    Math.max(
      0,
      prev - documentsToRemove
    )
  );

  setIssuesResolved((prev) =>
    Math.max(
      0,
      prev - issuesToRemove
    )
  );

  setSchemesFound((prev) =>
    Math.max(
      0,
      prev - schemesToRemove
    )
  );

  // REMOVE ACTIVITIES

  setActivities((prev) =>
    prev.filter(
      (activity) =>
        !ids.includes(activity.id)
    )
  );
};

  // =====================================
  // PROVIDER
  // =====================================

  return (
    <DashboardContext.Provider
      value={{
        uploadedDocuments,
        issuesResolved,
        schemesFound,

        activities,
        notifications,

        addActivity,
        addNotification,
        markNotificationRead,

        incrementDocuments,
        incrementIssuesResolved,
        incrementSchemesFound,

        resetDashboard,
        deleteActivities,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () =>
  useContext(DashboardContext);