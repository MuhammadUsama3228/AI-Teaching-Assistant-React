import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import TeacherProfile from './pages/teacher/profile/teacher_profile.jsx';
import Login from './pages/Login';
import Home from './pages/Home';
import  StudentCourseOverviewAccordion from './components/student/Student_course/Student_course_detail.jsx'
import StudentPanelDashboard from './pages/student/studentdasboard.jsx';
import PageNotFound from './pages/Page404';
import Register from './pages/registration';
import Logout from './pages/Logout';
import TeacherPanel from './pages/teacher/teacherpanal';
import Teacher_profile_edit from "./pages/teacher/profile/teacher_profile_edit.jsx";
import VerifyEmail from './pages/emailverifiactionsent';
import Choicerole from './pages/rolechoice';
import ForgotPassword from './pages/Forgetpassword';
import ResetPassword from './pages/forgetpasswordconfirm';
import Assignmentuploadpage from './pages/teacher/assignment/assignmentcreate';
import Assignmentreadpage from './pages/teacher/assignment/assignmentread';
import Student_profile_edit from "./pages/student/profile/student_profile_edit.jsx";

import CourseViewPage from './pages/teacher/course/course_view_page';
import UpdateAssignmentForm from './components/teacher/assignment/update_assignment';
import CourseDetailPage from './pages/teacher/course/course_detail_page';
import CourseCreatePage from './pages/teacher/course/course_create_page';
import CourseUpdatePage from './pages/teacher/course/course_update_page';
import Assignmentdetailpage from './pages/teacher/assignment/assignmnet_detail_page';

import CourseWeekCreatePage from './pages/teacher/courseweek/course_week_create_page';
import CourseWeekViewPage from './pages/teacher/courseweek/course_week_view_page';
import CourseWeekDetailPage from './pages/teacher/courseweek/course_week_detail_page';
import CourseWeekUpdatePage from './pages/teacher/courseweek/course_week_update';
import WeekAnnViewPage from './pages/teacher/weekannouncement/week_announcement_view_page';
import WeekAnnCreatePage from './pages/teacher/weekannouncement/week_announcement_create_page';
import AssignmentDetailPage from './components/teacher/assignment/detail_assignmet';
import WeekAnnUpdatePage from './pages/teacher/weekannouncement/week_announcement_update_page';
import AssignmentSubmissionStatusPage from './pages/teacher/assignment/assignmentSubmisiionStatusPage';

import WeekAnnouncementForm from './components/teacher/courses/week_announcement/week_announcement_create';
import TimeSlotForm from './components/teacher/courses/timeslot/timeslot_create';
import AssignmentAllread from './pages/teacher/assignment/assignment_read_all_page';
import StudentPanel from './pages/student/student_panal';
import StudentProfile from "./pages/student/profile/student_profile.jsx";

import EnrollmentPage from './components/teacher/courses/enrollment/enrollment_create'
import ButtonBar from './components/student/studentnav';
import api from "./api.js";
import { setCsrfToken } from "./features/api/csrf_token.js";
import CreateTeacherProfile from './components/teacher/profile/teacher_profile.jsx';
import TeacherExperienceForm from './components/teacher/profile/teacher_experience.jsx';


import {useSelector, useDispatch} from "react-redux";



import CourseEnrollmentPage from './components/teacher/Enrollment/enroll_student.jsx';

import StudentCourseweekpage from './pages/student/student_course_week_page.jsx';
import StudentCourseWeekDetailView from './pages/student/student_course-week_detail_page.jsx';
import EnrolledCourses from './components/student/Student_course/student_course.jsx';
import StudentPanelAssignmet from './pages/student/student_assignmet.jsx';
import StudentPanelAssignmetDetail from './pages/student/student_assignmet_detail_page.jsx';

import CreateStudentProfile from './components/teacher/profile/student_profile.jsx';
import StudentProfilePage from './pages/profile/profile/Student.jsx';
import TeacherProfileUpdate from './pages/teacher/manage_teacher_profile.jsx';
import StudentPanelAnnouncementPgae from './pages/student/student_announcement_page.jsx';
import StudentPannalAnnouncementDetailPage from './pages/student/student_announce_detail_page.jsx';
import AssignmentSubmissionForm from './components/student_assignmet_sub_page.jsx'

import StudentPanelTimeSlotPage from './pages/student/student_time_slot_detail_page.jsx'
import StudentProfileUpdate from './pages/student/manage_student_profile.jsx';
import AboutUsPage from './pages/About.jsx'

import ContactUsPage from './pages/contactus.jsx';
import EnrollmentDashboard from './components/teacher/Enrollment/class_room.jsx';
import CreateTimeViewPage from "./pages/teacher/course/timeslotpage.jsx";
import Timeslotpage from "./pages/teacher/timeslotpage.jsx";
function RegisterAndLogout() {
    localStorage.clear();
    return <Register />;
}

function App() {
    const dispatch = useDispatch();
    const csrfToken = useSelector((state) => state.csrf.CSRF_TOKEN);

    async function getCSRF() {
        if (!csrfToken) {
            try {
                const response = await api.get("/get_csrf/");
                if (response.status === 200 && response.data.csrfToken) {
                    const newCsrfToken = response.data.csrfToken;
                    dispatch(setCsrfToken(newCsrfToken));
                    api.defaults.headers.common["X-CSRFToken"] = newCsrfToken;
                } else {
                    console.error("Invalid CSRF response:", response);
                }
            } catch (error) {
                console.error("Error fetching CSRF:", error);
            }
        } else {
            api.defaults.headers.common["X-CSRFToken"] = csrfToken;
        }
    }

    useEffect(() => {
        getCSRF();
    }, []);

    return (
        <BrowserRouter>

            <Routes>
                <Route path='/' element={<Home />} />
                 <Route path='/about' element={<AboutUsPage />} />
                 <Route path='/contact' element={<ContactUsPage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<RegisterAndLogout />} />
                <Route path='/register/verifyemail/' element={<VerifyEmail />} />
                <Route path='/logout' element={<Logout />} />
                <Route path='/choice' element={<Choicerole />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/confirmresetpasword' element={<ResetPassword />} />
                <Route path='/teacherpanel' element={<TeacherPanel />} />
                <Route path='/create_profile/:id' element={<CreateTeacherProfile />} />

                <Route path='/studentpanel' element={<StudentPanel />} />
                <Route path='/EnrollmentPage' element={<EnrollmentPage />} />
                <Route path='/create-course' element={<CourseCreatePage />} />
                <Route path='/view-courses' element={<CourseViewPage />} />
                <Route path="/coursedetail/:id" element={<CourseDetailPage />} />
                <Route path="/update-course/:id" element={<CourseUpdatePage />} />
                <Route path='/course_week_create' element={<CourseWeekCreatePage />} />
                <Route path='/course_week_view' element={<CourseWeekViewPage />} />
                <Route path='/courseweekdetail/:id' element={<CourseWeekDetailPage />} />
               
                <Route path="/course/:courseId/course_week/:courseWeekId/create_announcement_view" element={<WeekAnnouncementForm />} />
                <Route path="/course/:courseId/weeks/:courseWeekId/announcements" element={<WeekAnnViewPage />} />
                <Route path="/update-week-announcement/:id" element={<WeekAnnUpdatePage />} />
                <Route path="/create_assignment/:id" element={<Assignmentuploadpage />} />
                <Route path='/read_assignments/:id' element={<Assignmentreadpage />} />
                <Route path="/courses/assignments/:assignmentId/details" element={<Assignmentdetailpage />} />
                <Route path="/courses/assignment/:assignmentId/submissions" element={<AssignmentSubmissionStatusPage />} />
                <Route path='/update-assignment/:id' element={< UpdateAssignmentForm />} />
                <Route path='/view-assignments/' element={<AssignmentAllread />} />
                <Route path='/course-time-slots/:id' element={<CreateTimeViewPage />} />
                <Route path='/student_manage_profile' element={<StudentProfileUpdate />} />
              
                <Route path='/studentpanal' element={<ButtonBar />} />
                <Route path='*' element={<PageNotFound />} />
                <Route path='/' element={<Home/>}/>

                 {/*                   profile api                    */}
                Teacher_profile_edit
                <Route path="/profile" element={<TeacherProfile />} />
                <Route path='/edit_teacher_profile' element={<Teacher_profile_edit/>}/>
                <Route path='/create_teacher_profile' element={<CreateTeacherProfile/>}/>
                <Route path='/experience' element={<TeacherExperienceForm/>}/>
                {/* CourseEnrollmentPage */}
                <Route path='/courseEnrollmentPage' element={<CourseEnrollmentPage/>}/>
                <Route path='/experience' element={<TeacherExperienceForm/>}/>
                <Route path='/register' element={<RegisterAndLogout/>}/>
                <Route path='/verifyemail' element={<VerifyEmail/>}/>
                <Route path='/logout' element={<Logout/>}/>
                <Route path='/choice' element={<Choicerole/>}/>
                <Route path='/forgetpassword' element={<ForgotPassword/>}/>
                <Route path='/confirmresetpasword' element={<ResetPassword/>}/>
                <Route path='/teacherpanel' element={<TeacherPanel/>}/>
              
                <Route path='/create-course' element={<CourseCreatePage/>}/>
                <Route path='/view-courses' element={<CourseViewPage/>}/>
                <Route path="/coursedetail/:id" element={<CourseDetailPage/>}/>
                <Route path="/update-course/:id" element={<CourseUpdatePage/>}/>
                <Route path='/create_assignment' element={<Assignmentuploadpage/>}/>
                <Route path='/view-assignments' element={<Assignmentreadpage/>}/>
                <Route path='/submission-status' element={<AssignmentSubmissionStatusPage/>}/>
                <Route path='/student_course_week/:courseId' element={<StudentCourseweekpage />} />
                <Route path='/studentcourseweekdetail/:id' element={<StudentCourseWeekDetailView />} />
                <Route path='/enrolled-courses' element={<EnrolledCourses />} />
                <Route path='*' element={<PageNotFound/>}/>
                <Route path='/StudentDashboard' element={<StudentPanelDashboard/>}/>
                <Route path='/StudentAssignment' element={<StudentPanelAssignmet/>}/>
                <Route path="/assignment/detail/:assignmentId" element={<StudentPanelAssignmetDetail />} />
                <Route path="/studentprofilecreate" element={<CreateStudentProfile />} />
                <Route path="/studentprofile" element={< StudentProfile/>} />
                <Route path="/student_profile_edit" element={<Student_profile_edit />} />
                <Route path="/course-weeks/:id/announcements" element={<StudentPanelAnnouncementPgae />} />
                <Route path="/announcements/:announcementId" element={<StudentPannalAnnouncementDetailPage />} />
                <Route path="/assignment/submit/:id" element={<AssignmentSubmissionForm />} />
                <Route path="/viewtimeslot" element={<Timeslotpage />} />
                <Route path="/time-slot/:id" element={<StudentPanelTimeSlotPage />} />
                <Route path="/teacher_manage_profile" element={<TeacherProfileUpdate />} />
                <Route path="/classroom" element={<EnrollmentDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
