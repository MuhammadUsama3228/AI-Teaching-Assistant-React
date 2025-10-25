import Navbar from "../../components/student/studentnav";
import EnrolledCourses from "../../components/student/Student_course/student_course.jsx"
import AssignmentViewPage from "../../components/student/Student Assignment/student_assignmet.jsx";
function StudentPanel(){
    return(
        <div>
             <Navbar />
             <EnrolledCourses />
        </div>
        
    );
}
export default StudentPanel;