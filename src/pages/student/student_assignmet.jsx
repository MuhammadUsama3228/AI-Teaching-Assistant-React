import Navbar from "../../components/student/studentnav";
import EnrolledCourses from "../../components/student/student_course"
import AssignmentViewPage from "../../components/student/student_assignmet";
function StudentPanelAssignmet(){
    return(
        <div>
             <Navbar />
             <AssignmentViewPage />
        </div>
        
    );
}
export default StudentPanelAssignmet;