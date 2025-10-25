import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Avatar,
} from "@mui/material";

import useCourseContent from "../hook/usecontent.jsx";
import useProfile from "../hook/profile.jsx";
import { BASE_URL } from "../../../../constraints.js";
import logo from "../../../../assets/logo.png";

const ChatBot = ({ courseId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const { courseContent, courseTitle, loading: contentLoading, askRagQA } = useCourseContent(courseId);
    const { profile, loading: profileLoading } = useProfile();

    const fileUrl = courseContent?.[0]?.file || "";

    useEffect(() => {
        if (courseTitle) {
            setMessages([
                {
                    sender: "bot",
                    text: `👋 Hello! I'm the AI TA for ${courseTitle}.\nYou can ask me anything related to this course content.`,
                },
            ]);
        }
    }, [courseTitle]);

    const sendMessage = async () => {
        if (!input.trim() || !courseId) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const contextPrompt = `
            You are an AI Teaching Assistant for the course "${courseTitle}".
            Answer only questions that are directly relevant to this course.
            You can reference the course file at ${fileUrl}.
            If a question is not related, politely respond: "I'm here to assist with topics only related to ${courseTitle}."
            `;

            const botReplyText = await askRagQA(input, contextPrompt);
            const botReply = { sender: "bot", text: botReplyText };
            setMessages((prev) => [...prev, botReply]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Sorry, something went wrong. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    if (contentLoading || profileLoading) return <CircularProgress sx={{ mt: 4 }} />;

    return (
        <Box
            sx={{
                maxWidth: 300,
                width: "100%",
                position: "fixed",
                bottom: 80,
                right: 20,
                height: 450,
                borderRadius: 3,
                boxShadow: 6,
                background: "linear-gradient(180deg, #ffffff, #f4e7ff)",
                display: "flex",
                flexDirection: "column",
                zIndex: 1500,
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    background: "linear-gradient(90deg, #4B2E83, #9271ff)",
                    color: "#fff",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="subtitle1" fontWeight="bold">AI TA</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "#00FF00",
                            boxShadow: "0 0 4px #00FF00",
                        }}
                    />
                    <Typography fontSize="0.75rem">We're online</Typography>
                </Box>
            </Box>

            {/* Messages */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    px: 2,
                    pt: 2,
                    pb: 1,
                }}
            >
                {messages.map((msg, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            display: "flex",
                            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                            mb: 1.5,
                            alignItems: "flex-start",
                        }}
                    >
                        {msg.sender === "bot" && (
                            <Avatar
                                sx={{ width: 28, height: 28, mr: 1 }}
                                alt="AI TA"
                                src={logo}
                            />
                        )}
                        {msg.sender === "user" && profile && (
                            <Avatar
                                src={`${BASE_URL}${profile.profile_picture}`}
                                alt={profile.username}
                                sx={{ width: 28, height: 28, ml: 1 }}
                            />
                        )}
                        <Box
                            sx={{
                                maxWidth: "75%",
                                px: 2,
                                py: 1.5,
                                borderRadius: "20px",
                                background:
                                    msg.sender === "user"
                                        ? "linear-gradient(90deg, #7f5af0, #9271ff)"
                                        : "#ffffff",
                                color: msg.sender === "user" ? "#fff" : "#333",
                                boxShadow:
                                    msg.sender === "user"
                                        ? "0 2px 8px rgba(127,90,240,0.2)"
                                        : "0 1px 4px rgba(0,0,0,0.1)",
                            }}
                        >
                            <Typography fontSize="0.9rem" sx={{ whiteSpace: "pre-line" }}>{msg.text}</Typography>
                        </Box>
                    </Box>
                ))}
                {loading && (
                    <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={18} />
                        <Typography fontSize="0.8rem">Thinking...</Typography>
                    </Box>
                )}
            </Box>

            {/* Input */}
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderTop: "1px solid #ddd",
                    backgroundColor: "#fff",
                }}
            >
                <TextField
                    fullWidth
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask something..."
                    size="small"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                            backgroundColor: "#f9f9f9",
                            px: 2,
                        },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={sendMessage}
                    sx={{
                        minWidth: 30,
                        height: 45,
                        borderRadius: "50%",
                        background: "linear-gradient(90deg, #4B2E83, #9271ff)",
                        boxShadow: "0 2px 6px rgba(127,90,240,0.4)",
                        "&:hover": {
                            background: "linear-gradient(90deg, #6d4ee0, #866dff)",
                        },
                    }}
                >
                    ➤
                </Button>
            </Box>
        </Box>
    );
};

export default ChatBot;
