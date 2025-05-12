import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

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
import PrivateRoute from './pages/private.jsx';
import WeekAnnouncementForm from './components/teacher/courses/week_announcement/week_announcement_create';
import TimeSlotForm from './components/teacher/courses/timeslot/timeslot_create';
import AssignmentAllread from './pages/teacher/assignment/assignment_read_all_page';
import StudentPanel from './pages/student/student_panal';
import Profile_Page from './pages/teacher/profile/profile_view';
import EnrollmentPage from './components/teacher/courses/enrollment/enrollment_create';
import ButtonBar from './components/student/studentnav';
import api from './api.js';
import { setCsrfToken } from './features/api/csrf_token.js';
import CreateTeacherProfile from './components/teacher/profile/teacher_profile.jsx';
import TeacherExperienceForm from './components/teacher/profile/teacher_experience.jsx';
import ManageProfile from './pages/profile/manage-profile/ManageProfile.jsx';
import UpdateProfile from './pages/profile/manage-profile/update_profile.jsx';
import TeacherProfileView from './pages/profile/profile/profile.jsx';
import CourseEnrollmentPage from './components/teacher/Enrollment/enroll_student.jsx';
import StudentCourseweekpage from './pages/student/student_course_week_page.jsx';
import StudentCourseWeekDetailView from './pages/student/student_course-week_detail_page.jsx';
import EnrolledCourses from './components/student/student_course.jsx';
import StudentDashboard from './components/student/student_dashboard.jsx';
import StudentPanelAssignmet from './pages/student/student_assignmet.jsx';
import StudentPanelAssignmetDetail from './pages/student/student_assignmet_detail_page.jsx';
import UpdateStudentProfile from './components/teacher/profile/student_profile_update.jsx';
import CreateStudentProfile from './components/teacher/profile/student_profile.jsx';
import StudentProfilePage from './pages/profile/profile/Student.jsx';
import TeacherProfileUpdate from './pages/teacher/manage_teacher_profile.jsx';
import StudentPanelAnnouncementPgae from './pages/student/student_announcement_page.jsx';
import StudentPannalAnnouncementDetailPage from './pages/student/student_announce_detail_page.jsx';
import AssignmentSubmissionForm from './components/student/student_assignmet_sub_page.jsx';
import TimeSlotView from './components/teacher/courses/timeslot/view_time_slot.jsx';
import StudentPanelTimeSlotPage from './pages/student/student_time_slot_detail_page.jsx';
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
                const response = await api.get('/get_csrf/');
                if (response.status === 200 && response.data.csrfToken) {
                    const newCsrfToken = response.data.csrfToken;
                    dispatch(setCsrfToken(newCsrfToken));
                    api.defaults.headers.common['X-CSRFToken'] = newCsrfToken;
                } else {
                    console.error('Invalid CSRF response:', response);
                }
            } catch (error) {
                console.error('Error fetching CSRF:', error);
            }
        } else {
            api.defaults.headers.common['X-CSRFToken'] = csrfToken;
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
                <Route path='/teacherpanel' element={<PrivateRoute><TeacherPanel /></PrivateRoute>} />
                <Route path='/create_profile/:id' element={<PrivateRoute><CreateTeacherProfile /></PrivateRoute>} />
                <Route path='/profile/:slug' element={<PrivateRoute><Profile_Page /></PrivateRoute>} />
                <Route path='/studentpanel' element={<PrivateRoute><StudentPanel /></PrivateRoute>} />
                <Route path='/EnrollmentPage' element={<PrivateRoute><EnrollmentPage /></PrivateRoute>} />
                <Route path='/create-course' element={<PrivateRoute><CourseCreatePage /></PrivateRoute>} />
                <Route path='/view-courses' element={<PrivateRoute><CourseViewPage /></PrivateRoute>} />
                <Route path='/coursedetail/:id' element={<PrivateRoute><CourseDetailPage /></PrivateRoute>} />
                <Route path='/update-course/:id' element={<PrivateRoute><CourseUpdatePage /></PrivateRoute>} />
                <Route path='/course_week_create' element={<PrivateRoute><CourseWeekCreatePage /></PrivateRoute>} />
                <Route path='/course_week_view' element={<PrivateRoute><CourseWeekViewPage /></PrivateRoute>} />
                <Route path='/courseweekdetail/:id' element={<PrivateRoute><CourseWeekDetailPage /></PrivateRoute>} />
                <Route path='/course/:courseId/course_week/:courseWeekId/create_announcement_view' element={<PrivateRoute><WeekAnnouncementForm /></PrivateRoute>} />
                <Route path='/courses/course/:courseId/weeks/:courseWeekId/announcements' element={<PrivateRoute><WeekAnnViewPage /></PrivateRoute>} />
                <Route path='/update-week-announcement/:id' element={<PrivateRoute><WeekAnnUpdatePage /></PrivateRoute>} />
                <Route path='/create_assignment/:id' element={<PrivateRoute><Assignmentuploadpage /></PrivateRoute>} />
                <Route path='/read_assignments/:id' element={<PrivateRoute><Assignmentreadpage /></PrivateRoute>} />
                <Route path='/courses/assignments/:assignmentId/details' element={<PrivateRoute><Assignmentdetailpage /></PrivateRoute>} />
                <Route path='/courses/assignment/:assignmentId/submissions' element={<PrivateRoute><AssignmentSubmissionStatusPage /></PrivateRoute>} />
                <Route path='/update-assignment/:id' element={<PrivateRoute><UpdateAssignmentForm /></PrivateRoute>} />
                <Route path='/view-assignments/' element={<PrivateRoute><AssignmentAllread /></PrivateRoute>} />
                <Route path='/course-time-slots/:id' element={<PrivateRoute><TimeSlotForm /></PrivateRoute>} />
                <Route path='/student_manage_profile' element={<PrivateRoute><StudentProfileUpdate /></PrivateRoute>} />
                <Route path='/studentpanal' element={<PrivateRoute><ButtonBar /></PrivateRoute>} />
                <Route path='*' element={<PageNotFound />} />
                <Route path='/profile' element={<PrivateRoute><TeacherProfileView /></PrivateRoute>} />
                <Route path='/teacher_profile' element={<PrivateRoute><CreateTeacherProfile /></PrivateRoute>} />
                <Route path='/experience' element={<PrivateRoute><TeacherExperienceForm /></PrivateRoute>} />
                <Route path='/courseEnrollmentPage' element={<PrivateRoute><CourseEnrollmentPage /></PrivateRoute>} />
                <Route path='/student_course_week/:courseId' element={<PrivateRoute><StudentCourseweekpage /></PrivateRoute>} />
                <Route path='/studentcourseweekdetail/:id' element={<PrivateRoute><StudentCourseWeekDetailView /></PrivateRoute>} />
                <Route path='/enrolled-courses' element={<PrivateRoute><EnrolledCourses /></PrivateRoute>} />
                <Route path='/StudentDashboard' element={<PrivateRoute><StudentPanelDashboard /></PrivateRoute>} />
                <Route path='/StudentAssignment' element={<PrivateRoute><StudentPanelAssignmet /></PrivateRoute>} />
                <Route path='/assignment/detail/:assignmentId' element={<PrivateRoute><StudentPanelAssignmetDetail /></PrivateRoute>} />
                <Route path='/studentprofilecreate' element={<PrivateRoute><CreateStudentProfile /></PrivateRoute>} />
                <Route path='/studentprofile' element={<PrivateRoute><StudentProfilePage /></PrivateRoute>} />
                <Route path='/course-weeks/:id/announcements' element={<PrivateRoute><StudentPanelAnnouncementPgae /></PrivateRoute>} />
                <Route path='/announcements/:announcementId' element={<PrivateRoute><StudentPannalAnnouncementDetailPage /></PrivateRoute>} />
                <Route path='/assignment/submit/:id' element={<PrivateRoute><AssignmentSubmissionForm /></PrivateRoute>} />
                <Route path='/viewtimeslot' element={<PrivateRoute><TimeSlotView /></PrivateRoute>} />
                <Route path='/time-slot/:id' element={<PrivateRoute><StudentPanelTimeSlotPage /></PrivateRoute>} />
                <Route path='/teacher_manage_profile' element={<PrivateRoute><TeacherProfileUpdate /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;