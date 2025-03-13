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
import VerifyEmail from './pages/emailverifiactionsent';
import Choicerole from './pages/rolechoice';
import ForgotPassword from './pages/Forgetpassword';
import ResetPassword from './pages/forgetpasswordconfirm';
import Assignmentuploadpage from './pages/teacher/assignment/assignmentcreate';
import Assignmentreadpage from './pages/teacher/assignment/assignmentread';
import AssignmentSubmissionStatusPage from './pages/teacher/assignment/assignmentSubmisiionStatusPage';
import AssignmentUpdatePage from './pages/teacher/assignment/assignmentUpdatePage';
import CourseViewPage from './pages/teacher/course/course_view_page';

import CourseDetailPage from './pages/teacher/course/course_detail_page';
import CourseCreatePage from './pages/teacher/course/course_create_page';
import CourseUpdatePage from './pages/teacher/course/course_update_page';

import ManageProfile from './pages/profile/manage-profile/ManageProfile.jsx';
import api from "./api.js";
import {useSelector, useDispatch} from "react-redux";
import {setCsrfToken} from "./features/api/csrf_token.js";
import Profile from "./pages/profile/profile/profile.jsx";



function RegisterAndLogout() {
    localStorage.clear();
    return <Register/>;
}

// import Cookies from 'js-cookie';

function App() {
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
}

export default App;
