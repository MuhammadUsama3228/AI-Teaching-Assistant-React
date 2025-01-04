import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import PageNotFound from './pages/Page404';
import Register from './pages/registration';
import Logout from './pages/Logout';
import ProtectedRoute from './components/ProtectedRoute';
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


function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />CourseUpdatePage
        <Route path='/register' element={<RegisterAndLogout />} />
        <Route path='/verifyemail' element={<VerifyEmail />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/choice' element={<Choicerole />} />
        <Route path='/forgetpassword' element={<ForgotPassword />} />
        <Route path='/confirmresetpasword' element={<ResetPassword />} />
        <Route path='/teacherpanel' element={<TeacherPanel />} />
        <Route path='/t' element={<TeacherProfileForm />} />
        <Route path='/create-course' element={<CourseCreatePage />} />
        <Route path='/view-courses' element={<CourseViewPage />} />
        <Route path="/coursedetail/:id" element={<CourseDetailPage />} />
        <Route path="/update-course/:id" element={<CourseUpdatePage />} />
        <Route path='/create_assignment' element={<Assignmentuploadpage />} />
        <Route path='/view-assignments' element={<Assignmentreadpage />} />
        <Route path='/submission-status' element={<AssignmentSubmissionStatusPage />} />
        <Route path='/assignmentupdate' element={<AssignmentUpdatePage />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
