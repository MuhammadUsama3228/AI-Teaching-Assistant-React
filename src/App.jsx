import React from 'react'
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import PageNotFound from './pages/Page404'
import Register from './pages/Register'
import Logout from './pages/Logout'
import ProtectedRoute from './components/ProtectedRoute'

function RegisterAndLogout(){
  
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          // <ProtectedRoute>
            <Home/>
          // </ProtectedRoute>
          }
        />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<RegisterAndLogout/>}/>
        <Route path='/logout' element={<Logout/>}/>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>   
  )
}

export default App
