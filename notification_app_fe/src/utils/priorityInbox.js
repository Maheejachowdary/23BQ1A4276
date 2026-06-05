import { Log } from "../middleware/logger";

const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

function scoreNotification(notification) {
  const weight = TYPE_WEIGHT[notification.Type] || 0;
  const recency = new Date(notification.Timestamp).getTime();
  return weight * 1e12 + recency;
}

export async function getTopN(notifications, n) {
  await Log("frontend", "info", "utils", `Computing top ${n} priority notifications from ${notifications.length} total`);

  if (!Array.isArray(notifications) || notifications.length === 0) {
    await Log("frontend", "warn", "utils", "Empty notifications array passed to getTopN");
    return [];
  }

  const sorted = [...notifications].sort(
    (a, b) => scoreNotification(b) - scoreNotification(a)
  );

  const result = sorted.slice(0, n);
  await Log("frontend", "info", "utils", `Returning top ${result.length} notifications: types=${result.map(r => r.Type).join(",")}`);
  return result;
}