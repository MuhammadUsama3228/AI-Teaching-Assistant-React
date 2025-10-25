import React, { useEffect, useState } from "react";
import api from "../../../../api.js";
import AssignmentPenaltyAccordion from "../assignment_panality.jsx";
import VariationPenaltyAccordion from "../variation_panality.jsx";

const PenaltyAccordionWrapper = ({ assignmentId }) => {
    const [hasAssignmentPenalty, setHasAssignmentPenalty] = useState(false);
    const [hasVariationPenalty, setHasVariationPenalty] = useState(false);

    useEffect(() => {
        const checkPenalties = async () => {
            try {
                const [assignmentPenaltyRes, variationPenaltyRes] = await Promise.all([
                    api.get("/api/courses/penalty/", {
                        params: { assignment: assignmentId },
                    }),
                    api.get("/api/courses/variation_penalty/", {
                        params: { assignment: assignmentId },
                    }),
                ]);

                setHasAssignmentPenalty(assignmentPenaltyRes.data.length > 0);
                setHasVariationPenalty(variationPenaltyRes.data.length > 0);
            } catch (error) {
                console.error("Error fetching penalties:", error);
            }
        };

        if (assignmentId) {
            checkPenalties();
        }
    }, [assignmentId]);

    return (
        <>
            {hasAssignmentPenalty && (
                <AssignmentPenaltyAccordion assignmentId={assignmentId} />
            )}
            {hasVariationPenalty && (
                <VariationPenaltyAccordion assignmentId={assignmentId} />
            )}
        </>
    );
};

export default PenaltyAccordionWrapper;
