import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';


import Login from './pages/Login';
import Home from './pages/Home';
import StudentPanelDashboard from './pages/student/studentdasboard.jsx';
import PageNotFound from './pages/Page404';
import Register from './pages/registration';
import Logout from './pages/Logout';
import TeacherPanel from './pages/teacher/teacherpanal';

import VerifyEmail from './pages/emailverifiactionsent';
import Choicerole from './pages/rolechoice';
import ForgotPassword from './pages/Forgetpassword';
import ResetPassword from './pages/forgetpasswordconfirm';
import Assignmentuploadpage from './pages/teacher/assignment/assignmentcreate';
import Assignmentreadpage from './pages/teacher/assignment/assignmentread';

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

import Profile_Page from './pages/teacher/profile/profile_view';
import EnrollmentPage from './components/teacher/courses/enrollment/enrollment_create'
import ButtonBar from './components/student/studentnav';
import api from "./api.js";
import { setCsrfToken } from "./features/api/csrf_token.js";
import CreateTeacherProfile from './components/teacher/profile/teacher_profile.jsx';
import TeacherExperienceForm from './components/teacher/profile/teacher_experience.jsx';

import ManageProfile from './pages/profile/manage-profile/ManageProfile.jsx';
import UpdateProfile from './pages/profile/manage-profile/update_profile.jsx';

import {useSelector, useDispatch} from "react-redux";

import TeacherProfileView from './pages/profile/profile/profile.jsx';

import CourseEnrollmentPage from './components/teacher/Enrollment/enroll_student.jsx';

import StudentCourseweekpage from './pages/student/student_course_week_page.jsx';
import StudentCourseWeekDetailView from './pages/student/student_course-week_detail_page.jsx';
import EnrolledCourses from './components/student/student_course.jsx';
import StudentDashboard from './components/student/student_dashboard.jsx'
import StudentPanelAssignmet from './pages/student/student_assignmet.jsx';
import StudentPanelAssignmetDetail from './pages/student/student_assignmet_detail_page.jsx';
import UpdateStudentProfile from './components/teacher/profile/student_profile_update.jsx';
import CreateStudentProfile from './components/teacher/profile/student_profile.jsx';
import StudentProfilePage from './pages/profile/profile/Student.jsx';
import TeacherProfileUpdate from './pages/teacher/manage_teacher_profile.jsx';
import StudentPanelAnnouncementPgae from './pages/student/student_announcement_page.jsx';
import StudentPannalAnnouncementDetailPage from './pages/student/student_announce_detail_page.jsx';
import AssignmentSubmissionForm from './components/student/student_assignmet_sub_page.jsx'
import TimeSlotView from './components/teacher/courses/timeslot/view_time_slot.jsx';
import StudentPanelTimeSlotPage from './pages/student/student_time_slot_detail_page.jsx'
import StudentProfileUpdate from './pages/student/manage_student_profile.jsx';

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
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<RegisterAndLogout />} />
                <Route path='/verifyemail' element={<VerifyEmail />} />
                <Route path='/logout' element={<Logout />} />
                <Route path='/choice' element={<Choicerole />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/confirmresetpasword' element={<ResetPassword />} />
                <Route path='/teacherpanel' element={<TeacherPanel />} />
                <Route path='/create_profile/:id' element={<CreateTeacherProfile />} />
                <Route path="/profile/:slug" element={<Profile_Page />} />
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
                <Route path="/courses/course/:courseId/weeks/:courseWeekId/announcements" element={<WeekAnnViewPage />} />
                <Route path="/update-week-announcement/:id" element={<WeekAnnUpdatePage />} />
                <Route path="/create_assignment/:id" element={<Assignmentuploadpage />} />
                <Route path='/read_assignments/:id' element={<Assignmentreadpage />} />
                <Route path="/courses/assignments/:assignmentId/details" element={<Assignmentdetailpage />} />
                <Route path="/courses/assignment/:assignmentId/submissions" element={<AssignmentSubmissionStatusPage />} />
                <Route path='/update-assignment/:id' element={< UpdateAssignmentForm />} />
                <Route path='/view-assignments/' element={<AssignmentAllread />} />
                <Route path='/course-time-slots/:id' element={<TimeSlotForm />} />
                <Route path='/student_manage_profile' element={<StudentProfileUpdate />} />
              
                <Route path='/studentpanal' element={<ButtonBar />} />
                <Route path='*' element={<PageNotFound />} />
                <Route path='/' element={<Home/>}/>

                 {/*                   profile api                    */}
                
                <Route path="/profile" element={<TeacherProfileView />} />

               
                <Route path='/teacher_profile' element={<CreateTeacherProfile/>}/>
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
                <Route path="/studentprofile" element={<StudentProfilePage />} />
                <Route path="/course-weeks/:id/announcements" element={<StudentPanelAnnouncementPgae />} />
                <Route path="/announcements/:announcementId" element={<StudentPannalAnnouncementDetailPage />} />
                <Route path="/assignment/submit/:id" element={<AssignmentSubmissionForm />} />
                <Route path="/viewtimeslot" element={<TimeSlotView />} />
                <Route path="/time-slot/:id" element={<StudentPanelTimeSlotPage />} />
                <Route path="/teacher_manage_profile" element={<TeacherProfileUpdate />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
