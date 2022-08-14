import React, { useState } from 'react' 
import './App.css' 
import './styles.css/event.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom' 
import Navbar from './components/Navbar' 
import LoginPage from './pages/Login' 
import EventsPage from './pages/Events' 
import BookingsPage from './pages/Bookings' 
import SignUpPage from './pages/SignUp' 
import AuthContext from './context/auth-context'
import PrivateRoute from './components/PrivateRoute' 

export default function App() {
  let [token, setToken] = useState(localStorage.getItem('token') || '') 
  let [userId, setUserId] = useState(localStorage.getItem('userId') || '') 
  let [username, setUsername] = useState(localStorage.getItem('username') || '') 

  const login = (userToken, loginUserId, username) => {
    if(userToken) {
      setToken(userToken) 
      localStorage.setItem("token", userToken) 
    }
    if(loginUserId) {
      setUserId(loginUserId) 
      localStorage.setItem("userId", loginUserId)
    } 
    if(username) {
      setUsername(username)
      localStorage.setItem("username", username) 
    }
  } 

  const logout = () => {
    setToken(null) 
    setUserId(null) 
    setUsername(null)
    localStorage.clear() 
  } 

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ token, userId, username, login, logout }}>
        <Navbar />
        <main className="main-content">
        <Routes>
          {token && <Route path="/login" element={<Navigate replace to="/events" />} exact />}
          <Route path='/login' element={<LoginPage />} />
          {token && <Route path="/signup" element={<Navigate replace to="/events" />} exact />}
          <Route path='/signup' element={<SignUpPage />} exact />
          <Route path="/" element={<Navigate replace to="/events" />} exact />
          <Route path='/events' element={<EventsPage />} />
        
          <Route path='/bookings' element={
            <PrivateRoute>
              <BookingsPage />
            </PrivateRoute>
          } />
          
        </Routes>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  ) 
}

