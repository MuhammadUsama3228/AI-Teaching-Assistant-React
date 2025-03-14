import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import Login from './pages/Login';
import Home from './pages/Home';
import PageNotFound from './pages/Page404';
import Register from './pages/registration';
import Logout from './pages/Logout';
import TeacherPanel from './pages/teacher/teacherpanal';
import TeacherProfileForm from './components/teacher/profile/profile_create';
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

import ManageProfile from './pages/profile/manage-profile/ManageProfile.jsx';
import Profile from "./pages/profile/profile/profile.jsx";
import Profile_Page from './pages/teacher/profile/profile_view';
import EnrollmentPage from './components/teacher/courses/enrollment/enrollment_create'
import ButtonBar from './components/student/studentnav';
import api from "./api.js";
import { setCsrfToken } from "./features/api/csrf_token.js";

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
                <Route path='/forgetpassword' element={<ForgotPassword />} />
                <Route path='/confirmresetpasword' element={<ResetPassword />} />
                <Route path='/teacherpanel' element={<TeacherPanel />} />
                <Route path='/create_profile/:id' element={<TeacherProfileForm />} />
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
                <Route path='/update-assignment/:id' element={<UpdateAssignmentForm />} />
                <Route path='/view-assignments/' element={<AssignmentAllread />} />
                <Route path='/course-time-slots/:id' element={<TimeSlotForm />} />
                <Route path='/manage-profile' element={<ManageProfile />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/studentpanal' element={<ButtonBar />} />
                <Route path='*' element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
