import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Announcement } from "@mui/icons-material";
import { Link } from "react-router-dom";
import api from "../../../api.js";

const THEME_COLOR = "#4B2E83";

const StudentAnnouncementPage = () => {
  const [courseWeeks, setCourseWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
          <CircularProgress sx={{ color: THEME_COLOR }} />
        </Box>
    );
  }

  return (
      <Box
          sx={{
            px: isMobile ? 2 : isTablet ? 4 : 8,
            py: isMobile ? 3 : 5,
            backgroundColor: "#fafafa",
            minHeight: "100vh",
          }}
      >
        <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight="bold"
            gutterBottom
            sx={{ color: THEME_COLOR }}
        >
          Course Announcements
        </Typography>

        {courseWeeks.map((week) =>
            week.week_announcements.length > 0 ? (
                <Card
                    key={week.id}
                    sx={{
                      mb: 4,
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                      maxWidth: "100%",
                      backgroundColor: "#fff",
                      borderLeft: `6px solid ${THEME_COLOR}`,
                    }}
                >
                  <CardContent>
                    <Box
                        display="flex"
                        flexDirection={isMobile ? "column" : "row"}
                        justifyContent="space-between"
                        alignItems={isMobile ? "flex-start" : "center"}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ color: THEME_COLOR, fontWeight: 700 }}>
                          {week.course_title} — {week.week_title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                        >
                          Week {week.week_number}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {week.week_announcements.map((announcement) => (
                        <Link
                            to={`/announcements/${announcement.id}`}
                            key={announcement.id}
                            style={{ textDecoration: "none" }}
                        >
                          <Box sx={{ mb: 3, cursor: "pointer" }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Announcement sx={{ color: THEME_COLOR }} />
                              <Typography variant="subtitle1" fontWeight={600}>
                                {announcement.title}
                              </Typography>
                            </Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 4, mt: 0.5 }}
                            >
                              {announcement.content}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.disabled"
                                sx={{ ml: 4, mt: 0.5 }}
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
