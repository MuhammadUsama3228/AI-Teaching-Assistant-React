import { useParams } from "react-router-dom";
import Navbar from "../../components/student/studentnav";
import StudentAnnouncementsPage from "../../components/student/student_announcemet/student_announcemet.jsx";

function StudentPanelAnnouncementPgae() {
    const { courseId, courseWeekId } = useParams(); // ✅ call hook inside component

    console.log("Parent Page - Course ID:", courseId);
    console.log("Parent Page - Course Week ID:", courseWeekId);

    return (
        <div>
            <Navbar />
            <StudentAnnouncementsPage courseId={courseId} courseWeekId={courseWeekId} />
        </div>
    );
}

export default StudentPanelAnnouncementPgae;
