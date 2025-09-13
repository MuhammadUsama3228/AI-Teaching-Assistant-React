import React, { useState } from "react";
import ChatBot from "./chat_bot.jsx";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Paper, Slide } from "@mui/material";

const ChatBotLauncher = ({ courseId }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Floating Button */}
            <Box
                sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    zIndex: 1300,
                }}
            >
                <IconButton
                    onClick={() => setOpen((prev) => !prev)}
                    sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: "#4B2E83",
                        color: "#fff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        "&:hover": {
                            backgroundColor: "#4B2E83",
                        },
                    }}
                >
                    {open ? <CloseIcon /> : <ChatIcon />}
                </IconButton>
            </Box>

            {/* Slide-up ChatBot */}
            <Slide direction="up" in={open} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 90,
                        right: 20,
                        width: 360,
                        maxWidth: "90vw",
                        zIndex: 1300,
                    }}
                >
                    <Paper elevation={6} sx={{ borderRadius: 3, overflow: "hidden" }}>
                        <ChatBot courseId={courseId} />
                    </Paper>
                </Box>
            </Slide>
        </>
    );
};

export default ChatBotLauncher;
