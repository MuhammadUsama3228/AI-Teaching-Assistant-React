import Navbar from "../../components/student/studentnav";
import EnrolledCourses from "../../components/student/student_course"
import AssignmentViewPage from "../../components/student/student_assignmet";
import StudentAssignmentDetailPage from "../../components/student/student_assignmet_detail";
function StudentPanelAssignmetDetail(){
    return(
        <div>
             <Navbar />
             <StudentAssignmentDetailPage />
        </div>
        
    );
}
export default StudentPanelAssignmetDetail;