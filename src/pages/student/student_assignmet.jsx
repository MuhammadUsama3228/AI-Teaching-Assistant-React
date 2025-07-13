import Navbar from "../../components/student/studentnav";
import EnrolledCourses from "../../components/student/Student_course/student_course.jsx"
import AssignmentViewPage from "../../components/student/Student Assignment/student_assignmet.jsx";
function StudentPanelAssignmet(){
    return(
        <div>
             <Navbar />
             <AssignmentViewPage />
        </div>
        
    );
}
export default StudentPanelAssignmet;