import Navbar from "../../components/student/studentnav";
import StudentDashboard from "../../components/student/student_dashboard";
function StudentPanelDashboard(){
    return(
        <div>
             <Navbar />
             <StudentDashboard />
        </div>
        
    );
}
export default StudentPanelDashboard;