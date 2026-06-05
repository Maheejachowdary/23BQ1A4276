import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";

const TYPE_CONFIG = {
  Placement: { color: "success", icon: <WorkIcon fontSize="small" /> },
  Result: { color: "primary", icon: <SchoolIcon fontSize="small" /> },
  Event: { color: "warning", icon: <EventIcon fontSize="small" /> },
};

export default function NotificationCard({ notification, isViewed, onView }) {
  const config = TYPE_CONFIG[notification.Type] || {
    color: "default",
    icon: <NotificationsActiveIcon fontSize="small" />,
  };

  return (
    <Card
      onClick={() => onView(notification.ID)}
      sx={{
        mb: 1.5,
        cursor: "pointer",
        border: isViewed ? "1px solid #e0e0e0" : "1px solid #1976d2",
        backgroundColor: isViewed ? "#fafafa" : "#f0f7ff",
        transition: "all 0.2s ease",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              icon={config.icon}
              label={notification.Type}
              color={config.color}
              size="small"
            />
            {!isViewed && (
              <Chip label="New" color="error" size="small" variant="outlined" />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {new Date(notification.Timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: isViewed ? 400 : 600 }}>
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
}
