// import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {useEffect} from 'react';

import Login from './pages/Login';
import Home from './pages/Home';
import PageNotFound from './pages/Page404';
import Register from './pages/registration';
import Logout from './pages/Logout';
// import ProtectedRoute from './components/ProtectedRoute';
import TeacherPanel from './pages/teacher/teacherpanal';
import TeacherProfileForm from './components/teacher/profile/profile_create';

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
import VerifyEmail from './pages/emailverifiactionsent';

import WeekAnnouncementForm from './components/teacher/courses/week_announcement/week_announcement_create';
import TimeSlotForm from './components/teacher/courses/timeslot/timeslot_create';
import AssignmentAllread from './pages/teacher/assignment/assignment_read_all_page';
import StudentPanel from './pages/student/student_panal';

import ManageProfile from './pages/profile/manage-profile/ManageProfile.jsx';
import api from "./api.js";
import {useSelector, useDispatch} from "react-redux";
import {setCsrfToken} from "./features/api/csrf_token.js";
import Profile from "./pages/profile/profile/profile.jsx";



import Profile_Page from './pages/teacher/profile/profile_view';

import EnrollmentPage from './components/teacher/courses/enrollment/enrollment_create'
import ButtonBar from './components/student/studentnav';
function RegisterAndLogout() {
    localStorage.clear();
    return <Register/>;
}

// import Cookies from 'js-cookie';

function App() {
<<<<<<< HEAD
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
        <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
        <Route path='/teacherpanel' element={<TeacherPanel />} />
        <Route path='/create_profile/:id' element={<TeacherProfileForm />} />

        <Route path="/profile/:slug" element={<Profile_Page />} />
        <Route path='/studentpanel' element={<StudentPanel />} />
        {/* Enrollment */}
        <Route path='/EnrollmentPage' element={<EnrollmentPage />} />

        {/* Courses */}
        <Route path='/create-course' element={<CourseCreatePage />} />
        <Route path='/view-courses' element={<CourseViewPage />} />
        <Route path="/coursedetail/:id" element={<CourseDetailPage />} />
        <Route path="/update-course/:id" element={<CourseUpdatePage />} />
        {/* Course_weeks */}
        <Route path='/course_week_create' element={<CourseWeekCreatePage />}/>
        <Route path='/course_week_view' element={<CourseWeekViewPage />}/>
        <Route path='/courseweekdetail/:id' element={<CourseWeekDetailPage />} />
     
        {/* Week announcement */}
        <Route path="/course/:courseId/course_week/:courseWeekId/create_announcement_view" element={<WeekAnnouncementForm/>} />

   
        <Route path="/courses/course/:courseId/weeks/:courseWeekId/announcements" element={<WeekAnnViewPage />} />  
        <Route path="/update-week-announcement/:id" element={<WeekAnnUpdatePage />} />  
       {/* Assignment */}
        <Route path="/create_assignment/:id" element={<Assignmentuploadpage />} />
        <Route path='/read_assignments/:id' element={<Assignmentreadpage />} />
        <Route path="/courses/assignments/:assignmentId/details" element={<Assignmentdetailpage />} />
        <Route path="/courses/assignment/:assignmentId/submissions" element={<AssignmentSubmissionStatusPage />} />
        <Route path='/update-assignment/:id' element={<UpdateAssignmentForm/>}/>

        <Route path='/view-assignments/' element={<AssignmentAllread />} />
        <Route path='/course-time-slots/:id' element={<TimeSlotForm/>} />

       

        {/* Submission */}
       
        <Route path='*' element={<PageNotFound />} />

        Studentview
        {/* {Student page links} */}
        <Route path='/studentpanal' element={<ButtonBar/>} />

      </Routes>
    </BrowserRouter>
  );
=======
    const dispatch = useDispatch();
    const csrfToken = useSelector((state) => state.csrf.CSRF_TOKEN);

    async function getCSRF() {
        // Check if csrfToken is missing or empty
        if (!csrfToken) {
            try {
                const response = await api.get("/get_csrf/");
                console.log("CSRF response:", response);

                if (response.status === 200 && response.data.csrfToken) {
                    const newCsrfToken = response.data.csrfToken;

                    // Save the token to redux store
                    dispatch(setCsrfToken(newCsrfToken));

                    // Set axios default header
                    api.defaults.headers.common["X-CSRFToken"] = newCsrfToken;
                } else {
                    console.error("Invalid CSRF response:", response);
                }
            } catch (error) {
                console.error("Error fetching CSRF:", error);
            }
        } else {
            // If csrfToken already exists in redux, set it in axios headers
            api.defaults.headers.common["X-CSRFToken"] = csrfToken;
            console.log("CSRF token from store applied to axios headers:", csrfToken);
        }
    }
    useEffect(() => {
        
    }, []);


    useEffect(() => {
        getCSRF();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>

                 {/*                   profile api                    */}
                <Route path='/manage-profile' element={<ManageProfile/>}/>

                <Route path='/profile' element={<Profile/>}/>

                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<RegisterAndLogout/>}/>
                <Route path='/verifyemail' element={<VerifyEmail/>}/>
                <Route path='/logout' element={<Logout/>}/>
                <Route path='/choice' element={<Choicerole/>}/>
                <Route path='/forgetpassword' element={<ForgotPassword/>}/>
                <Route path='/confirmresetpasword' element={<ResetPassword/>}/>
                <Route path='/teacherpanel' element={<TeacherPanel/>}/>
                <Route path='/t' element={<TeacherProfileForm/>}/>
                <Route path='/create-course' element={<CourseCreatePage/>}/>
                <Route path='/view-courses' element={<CourseViewPage/>}/>
                <Route path="/coursedetail/:id" element={<CourseDetailPage/>}/>
                <Route path="/update-course/:id" element={<CourseUpdatePage/>}/>
                <Route path='/create_assignment' element={<Assignmentuploadpage/>}/>
                <Route path='/view-assignments' element={<Assignmentreadpage/>}/>
                <Route path='/submission-status' element={<AssignmentSubmissionStatusPage/>}/>
                <Route path='/assignmentupdate' element={<AssignmentUpdatePage/>}/>
                <Route path='*' element={<PageNotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
>>>>>>> moeed
}

export default App;
