import Navbar from "../../components/student/studentnav";
import EnrolledCourses from "../../components/student/Student_course/student_course.jsx"
import StudentCourseOverviewAccordion from "../../components/student/Student_course/Student_course_detail.jsx";
function StudentCourseweekpage(){
    return(
        <div>
             <Navbar />
             <StudentCourseOverviewAccordion />
        </div>
        
    );
}
export default StudentCourseweekpage;