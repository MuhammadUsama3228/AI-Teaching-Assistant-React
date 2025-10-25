import { useParams } from "react-router-dom";
import Navbar from "../../components/student/studentnav";
import TimeSlotDetail from "../../components/student/time_slot_detail";

function StudentPanelTimeSlotPage() {
    

 

    return (
        <div>
            <Navbar />
            <TimeSlotDetail />
            
           
        </div>
    );
}

export default StudentPanelTimeSlotPage;
