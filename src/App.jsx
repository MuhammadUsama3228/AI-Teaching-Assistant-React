import React from 'react'
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import PageNotFound from './pages/Page404'
import Register from './pages/registration'
import Logout from './pages/Logout'
import ProtectedRoute from './components/ProtectedRoute'
import TeacherPanel from './pages/teacherpanal'


function RegisterAndLogout(){
  
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/logout' element={<Logout/>}/>
     
        <Route path='/teacherpanel' element={<TeacherPanel/>}/>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>   
  )
}

export default App
