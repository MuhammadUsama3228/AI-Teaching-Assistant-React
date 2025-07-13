import Navbar from "../../components/student/studentnav";
import EnrolledCourses from "../../components/student/Student_course/student_course.jsx"
import AssignmentViewPage from "../../components/student/Student Assignment/student_assignmet.jsx";
import StudentAssignmentDetailPage from "../../components/student/Student Assignment/student_assignmet_detail.jsx";
function StudentPanelAssignmetDetail(){
    return(
        <div>
             <Navbar />
             <StudentAssignmentDetailPage />
        </div>

    );
}
export default StudentPanelAssignmetDetail;