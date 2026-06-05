const { Log } = require("../logging_middleware/index");

/**
 * Priority Inbox Algorithm
 * Weight: Placement(3) > Result(2) > Event(1)
 * Score = typeWeight * 1000 + recencyScore
 * Uses a max-heap approach via sort for top-N selection
 */

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getRecencyScore(timestamp) {
  const date = new Date(timestamp);
  return date.getTime();
}

function scoreNotification(notification) {
  const weight = TYPE_WEIGHT[notification.Type] || 0;
  const recency = getRecencyScore(notification.Timestamp);
  return weight * 1e12 + recency;
}

/**
 * getTopN - returns top N priority notifications from a list
 * @param {Array} notifications - array of notification objects
 * @param {number} n - how many top notifications to return
 * @returns {Array} top N notifications sorted by priority
 */
function getTopN(notifications, n) {
  Log("frontend", "info", "utils", `getTopN called with ${notifications.length} notifications, n=${n}`);

  if (!Array.isArray(notifications) || notifications.length === 0) {
    Log("frontend", "warn", "utils", "getTopN received empty or invalid notifications array");
    return [];
  }

  const scored = notifications.map((notif) => ({
    ...notif,
    _score: scoreNotification(notif),
  }));

  scored.sort((a, b) => b._score - a._score);

  const result = scored.slice(0, n).map(({ _score, ...notif }) => notif);

  Log("frontend", "info", "utils", `getTopN returning ${result.length} notifications`);
  return result;
}

module.exports = { getTopN, scoreNotification };