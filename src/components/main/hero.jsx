import { Button, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";

const HeroSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                background: "linear-gradient(to right, #2e003e, #000000)",
                color: "white",
                textAlign: "center",
                px: { xs: 3, md: 6 },
                py: { xs: 8, md: 12 },
                borderRadius: "0 0 24px 24px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                minHeight: "75vh",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <Typography
                    variant={isMobile ? "h4" : "h3"}
                    fontWeight="bold"
                    gutterBottom
                    sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
                >
                    Revolutionize Your Teaching Experience
                </Typography>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        mb: 4,
                        fontWeight: 300,
                        maxWidth: "700px",
                        color: "#e0e0e0",
                        textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                    }}
                >
                    Meet your AI-powered Teaching Assistant. Automate grading, personalize learning,
                    and save time so you can focus on what matters most — your students.
                </Typography>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
            >
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        background: "linear-gradient(to right, #8e2de2, #4a00e0)",
                        color: "#fff",
                        fontWeight: "bold",
                        px: 4,
                        py: 1.5,
                        borderRadius: "8px",
                        textTransform: "none",
                        boxShadow: "0px 6px 20px rgba(138, 43, 226, 0.4)",
                        transition: "all 0.3s ease",
                        ":hover": {
                            background: "linear-gradient(to right, #4a00e0, #8e2de2)",
                            boxShadow: "0px 8px 24px rgba(138, 43, 226, 0.5)",
                        },
                    }}
                >
                    Get Started
                </Button>
            </motion.div>
        </Box>
    );
};

export default HeroSection;
