import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import { Announcement } from "@mui/icons-material"; // Use Material-UI's Announcement icon
import { Link } from "react-router-dom"; // Import Link for navigation
import api from "../../api";

const StudentAnnouncementPage = () => {
  const [courseWeeks, setCourseWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/courses/course_weeks/")
      .then((res) => {
        setCourseWeeks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch announcements:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📢 Course Announcements
      </Typography>

      {courseWeeks.map((week) =>
        week.week_announcements.length > 0 ? (
          <Card
            key={week.id}
            sx={{
              mb: 2,
              boxShadow: 3,
              borderRadius: 2,
              width: "95%", // Set the width to make it smaller
              maxWidth: "600px", // Limit the maximum width
              marginLeft: "0", // Align cards to the left
              padding: 2, // Add some padding inside the card
            }}
          >
            <CardContent>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {week.course_title} - {week.week_title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Week {week.week_number}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {week.week_announcements.map((announcement) => (
                <Link
                  to={`/announcements/${announcement.id}`} // Link to the announcement detail page
                  key={announcement.id}
                  style={{ textDecoration: "none" }}
                >
                  <Box sx={{ mb: 3, cursor: "pointer" }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Announcement size={20} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {announcement.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 3, mt: 1 }}>
                      {announcement.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ ml: 3, mt: 0.5 }}
                    >
                      Posted on {new Date(announcement.announcement_date).toLocaleDateString()}
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                </Link>
              ))}
            </CardContent>
          </Card>
        ) : null
      )}
    </Box>
  );
};

export default StudentAnnouncementPage;
