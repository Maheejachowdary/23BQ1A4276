import { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AllNotifications from "./pages/AllNotifications";
import PriorityInbox from "./pages/PriorityInbox";

function TabPanel({ value, index, children }) {
  if (value !== index) return null;
  return <Box mt={3}>{children}</Box>;
}

export default function App() {
  const [tab, setTab] = useState(0);

  const handleChange = (_event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            College Notification Hub
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Tabs value={tab} onChange={handleChange} textColor="primary" indicatorColor="primary">
          <Tab label="All Notifications" />
          <Tab label="Priority Inbox" />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <AllNotifications />
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <PriorityInbox />
        </TabPanel>
      </Container>
    </>
  );
}
