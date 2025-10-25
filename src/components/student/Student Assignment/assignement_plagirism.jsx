import React, { useEffect, useState } from "react";
import api from '../../../api.js'
import {
    Card,
    CardContent,
    Typography,
    Alert,
} from "@mui/material";

const ScannedDocumentDetails = ({ submissionId, submissionFileId }) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await api.get(
                    `/api/evaluation/scanned-documents/`,
                    {
                        params: {
                            submission: submissionId,
                            submission_file: submissionFileId,
                        },
                    }
                );
                if (response.data.length > 0) {
                    setDocument(response.data[0]);
                } else {
                    setError("No scanned document found.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch document.");
            }
        };

        fetchDocument();
    }, [submissionId, submissionFileId]);

    if (error) return <Alert severity="error">{error}</Alert>;
    if (!document) return null;

    return (
        <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Scanned Document Details
                </Typography>
                <Typography><strong>Filename:</strong> {document.filename}</Typography>
                <Typography><strong>Scan ID:</strong> {document.scan_id}</Typography>
                <Typography><strong>Total Words:</strong> {document.total_words}</Typography>
                <Typography><strong>Detected Language:</strong> {document.detected_language || "N/A"}</Typography>
                <Typography><strong>Plagiarism Score:</strong> {document.plagiarism_percentage}%</Typography>
                <Typography>
                    <strong>Alerts:</strong>{" "}
                    {document.alerts.length > 0
                        ? document.alerts.map((alert) => alert.code).join(", ")
                        : "None"}
                </Typography>

            </CardContent>
        </Card>
    );
};

export default ScannedDocumentDetails;
