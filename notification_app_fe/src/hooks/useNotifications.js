import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../api/notifications";
import { getTopN } from "../utils/priorityInbox";
import { Log } from "../middleware/logger";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem("viewedNotificationIds");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const loadNotifications = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    await Log("frontend", "debug", "hook", `loadNotifications triggered with params: ${JSON.stringify(params)}`);
    try {
      const data = await fetchNotifications(params);
      setNotifications(data);
      await Log("frontend", "info", "hook", `Notifications state updated with ${data.length} items`);
    } catch (err) {
      setError("Failed to load notifications. Please try again.");
      await Log("frontend", "error", "hook", `useNotifications error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsViewed = useCallback((id) => {
    setViewedIds((prev) => {
      const updated = new Set(prev);
      updated.add(id);
      localStorage.setItem("viewedNotificationIds", JSON.stringify([...updated]));
      return updated;
    });
  }, []);

  const getPriorityNotifications = useCallback(async (n) => {
    return await getTopN(notifications, n);
  }, [notifications]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    loading,
    error,
    viewedIds,
    markAsViewed,
    loadNotifications,
    getPriorityNotifications,
  };
}