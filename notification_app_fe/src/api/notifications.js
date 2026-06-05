import axios from "axios";
import { Log } from "../middleware/logger";

const BASE_URL = "http://4.224.186.213/evaluation-service";

const getApi = () =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

export async function fetchNotifications(params = {}) {
  await Log("frontend", "info", "api", `Fetching notifications with params: ${JSON.stringify(params)}`);
  try {
    const response = await getApi().get("/notifications", { params });
    const notifications = response.data.notifications || [];
    await Log("frontend", "info", "api", `Successfully fetched ${notifications.length} notifications`);
    return notifications;
  } catch (error) {
    await Log("frontend", "error", "api", `Notification fetch failed: ${error.message}`);
    throw error;
  }
}