import axios from "axios";

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

export async function Log(stack, level, packageName, message) {
  try {
    await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Log Success:", message);
  } catch (error) {
    console.error(
      "Log Error:",
      error.response?.data || error.message
    );
  }
}