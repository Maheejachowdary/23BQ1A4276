const axios = require("axios");
require("dotenv").config();

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

const VALID_STACKS = ["frontend", "backend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = {
  frontend: ["api", "component", "hook", "page", "state", "style", "auth", "config", "middleware", "utils"],
  backend: ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service", "auth", "config", "middleware", "utils"],
};

/**
 * Log - sends a structured log entry to the evaluation server
 * @param {string} stack - "frontend" | "backend"
 * @param {string} level - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg - package name (stack-dependent)
 * @param {string} message - descriptive log message
 */
async function Log(stack, level, pkg, message) {
  if (!VALID_STACKS.includes(stack)) {
    console.error(`[Logger] Invalid stack: "${stack}"`);
    return;
  }
  if (!VALID_LEVELS.includes(level)) {
    console.error(`[Logger] Invalid level: "${level}"`);
    return;
  }
  if (!VALID_PACKAGES[stack].includes(pkg)) {
    console.error(`[Logger] Invalid package: "${pkg}" for stack "${stack}"`);
    return;
  }

  try {
    const response = await axios.post(
      LOG_API,
      { stack, level, package: pkg, message },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`[Logger] ✓ ${stack}/${pkg} [${level}] — ${message}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`[Logger] ✗ Server error: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`[Logger] ✗ Network error: ${error.message}`);
    }
  }
}

module.exports = { Log };