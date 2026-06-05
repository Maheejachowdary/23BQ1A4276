import { useState, useEffect } from "react";
import {
  Box, Typography, CircularProgress, Alert,
  TextField, Button, Divider, Chip
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationCard from "../components/NotificationCard";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "../middleware/logger";

export default function PriorityInbox() {
  const { notifications, loading, error, viewedIds, markAsViewed, loadNotifications } = useNotifications();
  const [topN, setTopN] = useState(10);
  const [prioritized, setPrioritized] = useState([]);

  useEffect(() => {
    computePriority();
  }, [notifications, topN]);

  const computePriority = async () => {
    if (notifications.length === 0) return;
    await Log("frontend", "info", "page", `Computing priority inbox for top ${topN} notifications`);
    const { getTopN } = await import("../utils/priorityInbox");
    const result = await getTopN(notifications, Number(topN));
    setPrioritized(result);
  };

  const handleRefresh = async () => {
    await Log("frontend", "info", "page", "User refreshed priority inbox");
    await loadNotifications();
  };

  const handleView = async (id) => {
    markAsViewed(id);
    await Log("frontend", "info", "page", `Priority notification viewed: ${id}`);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <StarIcon color="warning" />
        <Typography variant="h5" fontWeight={700}>
          Priority Inbox
        </Typography>
        <Chip
          label={`Top ${topN}`}
          color="warning"
          size="small"
          variant="outlined"
        />
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Notifications ranked by type weight (Placement &gt; Result &gt; Event) and recency.
      </Typography>

      <Box display="flex" gap={2} mb={2} alignItems="center">
        <TextField
          size="small"
          label="Show Top N"
          type="number"
          value={topN}
          onChange={(e) => setTopN(Math.max(1, Number(e.target.value)))}
          sx={{ width: 120 }}
          inputProps={{ min: 1 }}
        />
        <Button
          variant="contained"
          color="warning"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          size="small"
        >
          Refresh
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && prioritized.length === 0 && (
        <Alert severity="info">No priority notifications found.</Alert>
      )}
      {!loading &&
        prioritized.map((n) => (
          <NotificationCard
            key={n.ID}
            notification={n}
            isViewed={viewedIds.has(n.ID)}
            onView={handleView}
          />
        ))}
    </Box>
  );
}