import Navbar from "../../components/student/studentnav";
import EnrolledCourses from "../../components/student/student_course"
import AssignmentViewPage from "../../components/student/student_assignmet";
function StudentPanel(){
    return(
        <div>
             <Navbar />
             <EnrolledCourses />
        </div>
        
    );
}
export default StudentPanel;