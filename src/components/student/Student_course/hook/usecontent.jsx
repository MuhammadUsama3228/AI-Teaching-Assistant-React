import { useEffect, useState } from "react";
import api from "../../../../api.js";

const useCourseContent = (courseId) => {
    const [courseContent, setCourseContent] = useState([]);
    const [courseTitle, setCourseTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch course content when courseId changes
    useEffect(() => {
        const fetchCourseContent = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/courses/course_content/?course=${courseId}`);

                if (Array.isArray(response.data)) {
                    setCourseContent(response.data);
                    setCourseTitle(response.data[0]?.course_title || "Untitled Course");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load course content");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) fetchCourseContent();
    }, [courseId]);

    // Ask RAG-based question
    const askRagQA = async (query, contextPrompt = "") => {
        try {
            const courseContentId = courseContent[0]?.id;
            if (!courseContentId) return "No course content available.";

            const response = await api.post(
                `/api/courses/rag_qa/?course_id=${courseId}&course_content_id=${courseContentId}`,
                { query, context_prompt: contextPrompt }
            );

            const result = response.data?.results?.[0];
            return result?.answer || "Sorry, I couldn't find an answer.";
        } catch (err) {
            console.error(err);
            return "Something went wrong while fetching the answer.";
        }
    };

    // Return all hook values
    return {
        courseContent,
        courseTitle,
        loading,
        error,
        askRagQA,
    };
};

export default useCourseContent;
