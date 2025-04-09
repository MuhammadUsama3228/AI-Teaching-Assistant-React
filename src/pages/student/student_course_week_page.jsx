import Navbar from "../../components/student/studentnav";
import EnrolledCourses from "../../components/student/student_course"
import StudentCourseWeekView from "../../components/student/student_courseweek";
function StudentCourseweekpage(){
    return(
        <div>
             <Navbar />
             <StudentCourseWeekView />
        </div>
        
    );
}
export default StudentCourseweekpage;