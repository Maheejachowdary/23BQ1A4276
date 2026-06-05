import { useState } from "react";
import {
  Box, Typography, CircularProgress, Alert, FormControl,
  InputLabel, Select, MenuItem, TextField, Button, Divider
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationCard from "../components/NotificationCard";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "../middleware/logger";

export default function AllNotifications() {
  const { notifications, loading, error, viewedIds, markAsViewed, loadNotifications } = useNotifications();
  const [typeFilter, setTypeFilter] = useState("");
  const [limit, setLimit] = useState(20);

  const handleRefresh = async () => {
    await Log("frontend", "info", "page", "User manually refreshed all notifications");
    const params = {};
    if (typeFilter) params.notification_type = typeFilter;
    if (limit) params.limit = limit;
    loadNotifications(params);
  };

  const handleView = async (id) => {
    markAsViewed(id);
    await Log("frontend", "info", "page", `Notification viewed: ${id}`);
  };

  const filtered = typeFilter
    ? notifications.filter((n) => n.Type === typeFilter)
    : notifications;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        All Notifications
      </Typography>

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={typeFilter}
            label="Filter by Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Limit"
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          sx={{ width: 100 }}
        />

        <Button
          variant="contained"
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
      {!loading && !error && filtered.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}
      {!loading &&
        filtered.map((n) => (
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